import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function BookingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItem = location.state;

  const [bookingData, setBookingData] = useState({
    processType: '',
    fabricType: '',
    serviceType: '',
    quantity: 100,
    duration: '24 hours',
    costPerMeter: 0,
    unit: 'kg',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    // Auto-populate booking data from selectedItem (passed from detail page)
    if (selectedItem) {
      const category = selectedItem.category || 'sizing';
      const processType = category === 'sizing' ? 'sizing' : 'weaving';
      const unit = selectedItem.unit || (category === 'sizing' ? 'kg' : 'metre');
      const quantity = selectedItem.quantity || 1;
      
      setBookingData(prev => ({
        ...prev,
        processType,
        fabricType: selectedItem.itemSlug || '',
        serviceType: selectedItem.itemSlug || '',
        costPerMeter: selectedItem.price || 0,
        quantity: quantity,
        unit: unit,
        notes: `Selected ${selectedItem.type === 'product' ? 'Product' : 'Service'}: ${selectedItem.item}`
      }));
    }
  }, [selectedItem]);

  // Calculate total order amount
  const total = bookingData.costPerMeter * bookingData.quantity;

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    if (bookingId) {
      try {
        await api.patch(`/bookings/${bookingId}`, { status: 'cancelled' });
      } catch (err) {
        console.error('Failed to cancel booking:', err);
      }
    }
    
    // Clear pending payment
    sessionStorage.removeItem('pendingPayment');
    
    // Show payment failed message and redirect to home
    setMessage('Payment failed. Redirecting to home...');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleResumePayment = async () => {
    const pendingPayment = sessionStorage.getItem('pendingPayment');
    if (!pendingPayment) {
      setMessage('No pending payment found');
      return;
    }

    try {
      const payment = JSON.parse(pendingPayment);
      const { paymentId, bookingId: resumeBookingId, orderId, amount } = payment;

      if (!window.Razorpay) {
        setMessage('Payment gateway not loaded. Please refresh the page.');
        return;
      }

      const key = process.env.VITE_RAZORPAY_KEY_ID || (await api.get('/payments/config')).data.key;

      const options = {
        key,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'CHINNU TEX',
        description: 'Sizing & Weaving Booking',
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId,
              bookingId: resumeBookingId
            });
            setMessage('Payment success! Booking confirmed.');
            sessionStorage.removeItem('pendingPayment');
            setBookingId(null);
            setTimeout(() => {
              navigate('/my-orders');
            }, 2000);
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            setMessage('Payment verification failed: ' + (verifyErr.response?.data?.message || verifyErr.message));
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: { color: '#2563eb' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error resuming payment:', err);
      setMessage('Failed to resume payment: ' + err.message);
    }
  };

  const handleClearPending = () => {
    sessionStorage.removeItem('pendingPayment');
    setMessage('Pending payment cleared');
  };

  const hasPendingPayment = !!sessionStorage.getItem('pendingPayment');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please sign in to book.');
      return;
    }
    
    // Validate booking data
    if (!bookingData.processType || !bookingData.fabricType) {
      setMessage('Please select a product or service');
      return;
    }
    
    if (total <= 0) {
      setMessage('Please select valid cost and quantity');
      return;
    }

    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      setMessage('Payment gateway not loaded. Please refresh the page.');
      console.error('Razorpay script not loaded');
      return;
    }

    try {
      setMessage('Creating booking...');
      console.log('Booking data being sent:', {
        processType: bookingData.processType,
        fabricType: bookingData.fabricType,
        serviceType: bookingData.serviceType,
        costPerMeter: bookingData.costPerMeter,
        quantityMeters: bookingData.quantity,
        duration: bookingData.duration,
        notes: bookingData.notes,
        totalAmount: total
      });
      
      const booking = await api.post('/bookings', {
        processType: bookingData.processType,
        fabricType: bookingData.fabricType,
        serviceType: bookingData.serviceType,
        costPerMeter: bookingData.costPerMeter,
        quantityMeters: bookingData.quantity,
        duration: bookingData.duration,
        notes: bookingData.notes,
        totalAmount: total
      });
      
      console.log('Booking created:', booking.data);
      setBookingId(booking.data._id);
      setMessage('Booking created. Creating payment order...');
      
      // Create Razorpay order
      const orderRes = await api.post('/payments/order', { amount: total });
      console.log('Payment order created:', orderRes.data);
      
      const { orderId, key, amount, currency, paymentId } = orderRes.data;

      // Store payment details for resuming later
      sessionStorage.setItem('pendingPayment', JSON.stringify({
        paymentId,
        bookingId: booking.data._id,
        orderId,
        amount: total,
        timestamp: new Date().toISOString()
      }));

      const options = {
        key,
        amount,
        currency,
        name: 'CHINNU TEX',
        description: 'Sizing & Weaving Booking',
        order_id: orderId,
        handler: async function (response) {
          console.log('Payment response:', response);
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId,
              bookingId: booking.data._id
            });
            console.log('Payment verified successfully');
            setMessage('Payment success! Booking confirmed.');
            setBookingId(null);
            // Clear pending payment
            sessionStorage.removeItem('pendingPayment');
            // Redirect to orders page
            setTimeout(() => {
              navigate('/my-orders');
            }, 2000);
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            setMessage('Payment verification failed: ' + (verifyErr.response?.data?.message || verifyErr.message));
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setMessage('Payment cancelled. Click "Resume Payment" below to continue with the same booking.');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: { color: '#4db8c4' }
      };

      console.log('Opening Razorpay modal with options:', options);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create order';
      setMessage(errorMsg);
    }
  };

  return (
	<div className="min-h-screen bg-gradient-to-b from-primary-50 via-accent-light/40 to-white py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-teal-600">
            Complete Your Booking
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Review your selection and proceed to secure payment</p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200">
          {/* Progress Indicator */}
          <div className="bg-gradient-to-r from-slate-200 to-teal-200 px-8 py-6">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-slate-600">1</div>
                <span className="text-slate-700 font-semibold hidden sm:inline">Review</span>
              </div>
              <div className="flex-1 h-1 bg-white/40 mx-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center font-bold text-slate-600">2</div>
                <span className="text-slate-600 font-semibold hidden sm:inline">Payment</span>
              </div>
              <div className="flex-1 h-1 bg-white/40 mx-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center font-bold text-slate-600">3</div>
                <span className="text-slate-600 font-semibold hidden sm:inline">Confirm</span>
              </div>
            </div>
          </div>

          {/* Selected Service/Product Info */}
          {selectedItem && (
            <div className="bg-teal-50 border-b border-teal-200 px-8 py-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Type</p>
                  <p className="text-lg font-bold text-slate-700">{selectedItem.type === 'product' ? 'Product' : 'Service'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-lg font-bold text-slate-700">{selectedItem.category === 'sizing' ? 'Sizing' : 'Weaving'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Selected Item</p>
                  <p className="text-lg font-bold text-slate-700">{selectedItem.item}</p>
                </div>
                {selectedItem.price && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Unit Price</p>
                    <p className="text-lg font-bold text-teal-600">₹{selectedItem.price}/{bookingData.unit}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Simple Booking Summary */}
          <div className="p-10 space-y-8">
            {/* Order Summary */}
            <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-8 border border-slate-200">
              <h3 className="text-lg font-bold mb-6 text-slate-700">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Selected Item:</span>
                  <span className="text-lg font-bold text-slate-700">{selectedItem?.item || 'Not selected'}</span>
                </div>
                {selectedItem?.price && (
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Unit Price:</span>
                    <span className="text-lg font-bold text-teal-600">₹{selectedItem.price}/{bookingData.unit}</span>
                  </div>
                )}
                {bookingData.quantity && (
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Quantity:</span>
                    <span className="text-lg font-bold text-slate-700">{bookingData.quantity} {bookingData.unit}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Service Type:</span>
                  <span className="text-lg font-bold text-slate-700">{selectedItem?.category === 'sizing' ? 'Sizing' : 'Weaving'}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Category:</span>
                  <span className="text-lg font-bold text-slate-700">{selectedItem?.type === 'product' ? 'Product' : 'Service'}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-teal-300">
                  <span className="text-slate-700 font-bold text-xl">Total Amount:</span>
                  <span className="text-2xl font-bold text-teal-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-slate-300">
                <p className="text-sm text-gray-500 mb-2">Booking Confirmation</p>
                <p className="text-lg text-slate-700"><strong>{selectedItem?.item}</strong> is ready to be booked</p>
                <p className="text-sm text-gray-500 mt-3">Click "Proceed to Payment" to complete your booking and proceed with secure payment</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleSubmit} 
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-5 rounded-xl text-lg font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Proceed to Payment
              </button>
              {hasPendingPayment && (
                <button 
                  type="button" 
                  onClick={handleResumePayment} 
                  className="flex-1 bg-gradient-to-r from-slate-400 to-blue-400 text-white py-5 rounded-xl text-lg font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M17.657 17.657a8 8 0 01-11.314 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Resume Payment
                </button>
              )}
              <button 
                type="button" 
                onClick={() => navigate('/')} 
                className="px-8 bg-slate-400 hover:bg-slate-500 text-white py-5 rounded-xl text-lg font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`mx-10 mb-10 p-6 rounded-xl text-center font-semibold ${
              message.includes('success') || message.includes('confirmed') 
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' 
                : message.includes('failed') || message.includes('error')
                ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                : 'bg-cyan-100 text-cyan-700 border-2 border-cyan-300'
            }`}>
              <div className="text-lg">{message}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
