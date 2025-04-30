const mongoose = require('mongoose');

const lorrySchema = new mongoose.Schema({
  name: String,
  vehicleNumber: String,
  location: [Number], // [lat, lng]
  gps: [Number],
  isAvailable: { type: Boolean, default: true },
  currentOrderId: String,
  otp: String
});

module.exports = mongoose.model('Lorry', lorrySchema);
