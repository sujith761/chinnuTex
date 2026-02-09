const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendInvoiceEmail } = require('../utils/email');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret'
});

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in INR
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // to paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    };
    
    console.log('Creating Razorpay order with options:', options);
    const order = await instance.orders.create(options);
    console.log('Razorpay order created:', order);

    const payment = await Payment.create({
      user: req.user.id,
      amount: Number(amount),
      currency: 'INR',
      status: 'created',
      razorpayOrderId: order.id
    });

    console.log('Payment record created:', payment);
    res.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency, 
      key: process.env.RAZORPAY_KEY_ID, 
      paymentId: payment._id 
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: err.message || 'Failed to create order' });
  }
};

exports.verify = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId, bookingId } = req.body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Payment secret not configured' });
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    console.log('Signature verification:', {
      provided: razorpay_signature,
      generated: generated_signature,
      match: generated_signature === razorpay_signature
    });

    const status = generated_signature === razorpay_signature ? 'success' : 'failed';

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status
      },
      { new: true }
    ).populate('user');

    let booking = null;
    if (bookingId && payment._id) {
      booking = await Booking.findByIdAndUpdate(
        bookingId, 
        { payment: payment._id, status: status === 'success' ? 'processing' : 'cancelled' },
        { new: true }
      ).populate('user');
      console.log('Booking updated with payment and status');
      
      // Send invoice email on successful payment
      if (status === 'success' && booking && payment.user) {
        const userEmail = payment.user.email;
        const userName = payment.user.name || payment.user.email;
        
        console.log('Sending invoice email to:', userEmail);
        sendInvoiceEmail(userEmail, userName, booking, payment)
          .then(result => {
            if (result.success) {
              console.log('Invoice email sent successfully');
            } else {
              console.error('Failed to send invoice email:', result.error);
            }
          })
          .catch(err => console.error('Error in email sending:', err));
      }
    }

    res.json({ status, payment });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ message: err.message || 'Failed to verify payment' });
  }
};

exports.all = async (req, res) => {
  try {
    const showDeleted = String(req.query.deleted) === 'true';
    const status = req.query.status;
    
    let query = { deleted: showDeleted };
    if (status) {
      query.status = status;
    }
    
    const items = await Payment.find(query).populate('user').populate('booking').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeOne = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Payment.findById(id);
    if (!item) return res.status(404).json({ message: 'Payment not found' });
    if (item.booking) {
      await Booking.findByIdAndUpdate(item.booking, { $unset: { payment: '' } });
    }
    item.deleted = true;
    item.deletedAt = new Date();
    await item.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeMany = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'ids array required' });
    }
    const items = await Payment.find({ _id: { $in: ids } });
    const bookingIds = items.map(i => i.booking).filter(Boolean);
    if (bookingIds.length) {
      await Booking.updateMany({ _id: { $in: bookingIds } }, { $unset: { payment: '' } });
    }
    await Payment.updateMany({ _id: { $in: ids } }, { $set: { deleted: true, deletedAt: new Date() } });
    res.json({ success: true, count: ids.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.restoreOne = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Payment.findById(id);
    if (!item) return res.status(404).json({ message: 'Payment not found' });
    item.deleted = false;
    item.deletedAt = null;
    await item.save();
    if (item.booking) {
      await Booking.findByIdAndUpdate(item.booking, { payment: item._id });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.restoreMany = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'ids array required' });
    }
    await Payment.updateMany({ _id: { $in: ids } }, { $set: { deleted: false, deletedAt: null } });
    const items = await Payment.find({ _id: { $in: ids } });
    const bookings = items.map(i => i.booking).filter(Boolean);
    if (bookings.length) {
      // restore links where possible
      await Booking.updateMany({ _id: { $in: bookings } }, [{ $set: { payment: { $cond: [{ $ne: ['$payment', null] }, '$payment', '$_id'] } } }]);
    }
    res.json({ success: true, count: ids.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.purgeOne = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Payment.findById(id);
    if (!item) return res.status(404).json({ message: 'Payment not found' });
    if (item.booking) {
      await Booking.findByIdAndUpdate(item.booking, { $unset: { payment: '' } });
    }
    await Payment.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.purgeMany = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'ids array required' });
    }
    const items = await Payment.find({ _id: { $in: ids } });
    const bookingIds = items.map(i => i.booking).filter(Boolean);
    if (bookingIds.length) {
      await Booking.updateMany({ _id: { $in: bookingIds } }, { $unset: { payment: '' } });
    }
    await Payment.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, count: ids.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.testEmail = async (req, res) => {
  try {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***configured***' : 'NOT SET');
    
    const { sendInvoiceEmail } = require('../utils/email');
    
    // Test email data
    const testEmail = 'sujith07cs@gmail.com';
    const testBooking = {
      _id: 'TEST-123',
      processType: 'sizing',
      serviceType: 'starch-sizing',
      fabricType: 'cotton',
      quantityMeters: 1000,
      costPerMeter: 50,
      duration: '24 hours',
      vehicleNumber: 'TEST-001',
      notes: 'This is a test email'
    };
    
    const testPayment = {
      razorpayPaymentId: 'pay_test_123',
      razorpayOrderId: 'ord_test_123',
      amount: 500,
      updatedAt: new Date()
    };
    
    const result = await sendInvoiceEmail(testEmail, 'Test User', testBooking, testPayment);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test email sent successfully', 
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send test email', 
        error: result.error 
      });
    }
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Test failed', 
      error: err.message 
    });
  }
};