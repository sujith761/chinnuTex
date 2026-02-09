const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ratePerMeter: { type: Number, required: true },
    processType: { type: String, enum: ['sizing', 'weaving'], required: true },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
