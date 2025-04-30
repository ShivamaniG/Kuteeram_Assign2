const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isDelivered: { type: Boolean, default: false },
  bidPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  productType: { type: String, required: true },
  status: { type: String, default: 'completed' },
  riceMillName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
