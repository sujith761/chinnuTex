const nodemailer = require('nodemailer');

// Create reusable transporter only if email is configured
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Verify email configuration on startup
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email configuration error:', error);
    } else {
      console.log('Email server is ready to send messages');
    }
  });
} else {
  console.log('Email not configured - emails will be disabled');
}

// Send invoice email
exports.sendInvoiceEmail = async (userEmail, userName, booking, payment) => {
  // Skip if email is not configured
  if (!transporter) {
    console.log('Email not configured - skipping invoice email');
    return { success: false, message: 'Email not configured' };
  }

  try {
    console.log('Starting to send invoice email to:', userEmail);
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .invoice-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .total { background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
          .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>� CHINNU TEX</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px;">Invoice & Payment Confirmation</p>
          </div>
          <div class="content">
            <p>Dear <strong>${userName}</strong>,</p>
            <p>Thank you for your booking! Your payment has been successfully processed.</p>
            
            <div class="success-badge">✓ Payment Successful</div>
            
            <div class="invoice-details">
              <h3 style="margin-top: 0; color: #667eea;">Booking Details</h3>
              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span class="value">${booking._id}</span>
              </div>
              <div class="detail-row">
                <span class="label">Process Type:</span>
                <span class="value">${booking.processType.charAt(0).toUpperCase() + booking.processType.slice(1)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Service Type:</span>
                <span class="value">${booking.serviceType ? booking.serviceType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Fabric Type:</span>
                <span class="value">${booking.fabricType.charAt(0).toUpperCase() + booking.fabricType.slice(1)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Quantity:</span>
                <span class="value">${booking.quantityMeters} meters</span>
              </div>
              <div class="detail-row">
                <span class="label">Cost Per Meter:</span>
                <span class="value">${booking.costPerMeter} p</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">${booking.duration}</span>
              </div>
              <div class="detail-row">
                <span class="label">Vehicle Number:</span>
                <span class="value">${booking.vehicleNumber || 'N/A'}</span>
              </div>
              ${booking.notes ? `
              <div class="detail-row">
                <span class="label">Special Instructions:</span>
                <span class="value">${booking.notes}</span>
              </div>
              ` : ''}
            </div>

            <div class="invoice-details">
              <h3 style="margin-top: 0; color: #667eea;">Payment Information</h3>
              <div class="detail-row">
                <span class="label">Payment ID:</span>
                <span class="value">${payment.razorpayPaymentId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Order ID:</span>
                <span class="value">${payment.razorpayOrderId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Method:</span>
                <span class="value">Razorpay</span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Date:</span>
                <span class="value">${new Date(payment.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value" style="color: #10b981; font-weight: bold;">Paid</span>
              </div>
            </div>

            <div class="total">
              Total Amount Paid: ₹${payment.amount.toLocaleString('en-IN')}
            </div>

            <p style="margin-top: 30px;">Your order is now being processed. We will notify you once it's ready.</p>
            <p>If you have any questions, please contact our support team.</p>

            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} CHINNU TEX. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'CHINNU TEX',
      to: userEmail,
      subject: `Invoice & Payment Confirmation - Booking #${booking._id}`,
      html: invoiceHTML
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending invoice email:', error.message);
    console.error('Full error:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
exports.testEmailConfig = async () => {
  if (!transporter) {
    console.log('Email not configured');
    return false;
  }
  
  try {
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};
