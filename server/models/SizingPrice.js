const mongoose = require('mongoose');

const sizingPriceSchema = new mongoose.Schema(
  {
    yarnType: { 
      type: String, 
      required: true, 
      unique: true,
      enum: ['Cotton', 'Polyester', 'Viscose', 'PC Blend', 'PV Blend', 'Nylon', 'Acrylic']
    },
    slug: { type: String, required: true, unique: true }, // cotton, polyester, etc.
    pricePerKg: { type: Number, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SizingPrice', sizingPriceSchema);
