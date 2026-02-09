const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    processType: { type: String, enum: ['sizing', 'weaving'], required: true },
    fabricType: { type: String, required: true },
    costPerMeter: { type: Number, required: true },
    quantityMeters: { type: Number, required: true },
    duration: { type: String, required: true },
    vehicleNumber: { type: String },
    notes: { type: String },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
