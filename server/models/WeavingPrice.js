const mongoose = require('mongoose');

const weavingPriceSchema = new mongoose.Schema(
  {
    fabricType: { 
      type: String, 
      required: true, 
      unique: true,
      enum: ['Cotton', 'Rayon', 'Polyester', 'Silk', 'Woollen', 'Linen', 'Nylon', 'Acrylic']
    },
    slug: { type: String, required: true, unique: true }, // cotton, rayon, etc.
    pricePerMetre: { type: Number, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeavingPrice', weavingPriceSchema);
