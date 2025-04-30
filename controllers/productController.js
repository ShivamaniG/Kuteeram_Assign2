const Product = require('../models/Product');
const Lorry = require('../models/Lorry');

exports.addProduct = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(400).json({ error: 'User not authenticated' });
      }
  
      const product = new Product({
        ...req.body, 
        sellerId: req.user.id 
      });
      await product.save();
      res.status(201).json({
        message: 'Product added successfully',
        product
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.editProduct = async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({
      message: 'Product updated successfully',
      product: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAvailable = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.id },
      { isAvailable: true },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({
      message: 'Product marked available',
      product
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.json({
      message: 'Dashboard fetched successfully',
      products
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendPickupOTP = async (req, res) => {
    const { lorryId } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
    const updated = await Lorry.findByIdAndUpdate(
      lorryId,
      { otp },
      { new: true }
    );
  
    if (!updated) return res.status(404).json({ message: 'Lorry not found' });
  
    res.json({ message: 'OTP sent to Lorry', otp }); 
  };