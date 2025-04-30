const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productType: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerTon: { type: Number, required: true },
  isAvailable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
