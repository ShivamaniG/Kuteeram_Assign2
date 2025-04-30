const Lorry = require('../models/Lorry');
const Bid = require('../models/Bid'); 
const User = require('../models/User'); 
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

// Register Lorry
exports.registerLorry = async (req, res) => {
  const lorry = new Lorry(req.body);
  await lorry.save();
  res.status(201).json({ message: 'Lorry registered', lorry });
};

// Login Lorry
exports.loginLorry = async (req, res) => {
  const { vehicleNumber } = req.body;
  const lorry = await Lorry.findOne({ vehicleNumber });
  if (!lorry) return res.status(404).json({ message: 'Lorry not found' });
  res.json({ message: 'Login successful', lorry });
};

// Notify Nearest Lorries (simulate)
exports.notifyLogistics = async (req, res) => {
    try {
      const location = req.body.location; // Expecting [lat, lng] in request
  
      if (!location || location.length !== 2) {
        return res.status(400).json({ message: 'Location must be [lat, lng]' });
      }
  
      const lorries = await Lorry.find({ isAvailable: true });
  
      if (lorries.length === 0) {
        return res.status(404).json({ message: 'No available lorries' });
      }
  
      const nearest = lorries
        .map(lorry => ({
          ...lorry._doc,
          dist: Math.sqrt(
            Math.pow(lorry.location[0] - location[0], 2) +
            Math.pow(lorry.location[1] - location[1], 2)
          )
        }))
        .sort((a, b) => a.dist - b.dist) 
        .slice(0, 3); 
  
      const driversCount = nearest.length;
      const message = driversCount === 1
        ? '1 nearest driver notified'
        : `${driversCount} nearest drivers notified`;
  
      res.json({
        message: message,
        drivers: nearest
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Accept Order
exports.acceptOrder = async (req, res) => {
    try {
      const { lorryId, orderId } = req.body;
  
      const lorry = await Lorry.findByIdAndUpdate(
        lorryId,
        {
          currentOrderId: orderId,
          isAvailable: false
        },
        { new: true }
      );
  
      if (!lorry) return res.status(404).json({ message: 'Lorry not found' });
  
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      const seller = await User.findById(order.sellerId);
      if (!seller) return res.status(404).json({ message: 'Seller not found' });
  
      res.json({
        message: 'Order accepted by lorry',
        location: lorry.location,
        lorryId: lorry._id,
        sellerName: seller.name,
        riceMillName: seller.riceMillName || `${seller.district || 'Unknown'} Rice Mill`
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Update GPS
exports.updateGPS = async (req, res) => {
  const { lorryId, gps } = req.body;
  await Lorry.findByIdAndUpdate(lorryId, { gps });
  res.json({ message: 'GPS updated' });
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
      const { lorryId, otp } = req.body;
  
      const lorry = await Lorry.findById(lorryId);
      if (!lorry || lorry.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      const order = await Order.findById(lorry.currentOrderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      const buyer = await User.findById(order.buyerId);
      if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
  
      const distance = Math.sqrt(
        Math.pow(lorry.location[0] - buyer.location[0], 2) +
        Math.pow(lorry.location[1] - buyer.location[1], 2)
      );
  
      res.json({
        message: 'OTP verified. Pickup allowed.',
        lorryLocation: lorry.location,
        buyerName: buyer.name,
        buyerPhone: buyer.phone,
        buyerLocation: buyer.location,
        distance: distance.toFixed(2) 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };