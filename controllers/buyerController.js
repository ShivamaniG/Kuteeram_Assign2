const Product = require('../models/Product');
const User = require('../models/User');
const Bid = require('../models/Bid');
const Order = require('../models/Order');

exports.searchProducts = async (req, res) => {
    const { productType, quantity } = req.query;
    try {
      const products = await Product.find({
        productType,
        quantity: { $gte: quantity },
        isAvailable: true
      });
  
      if (products.length === 0) {
        return res.json({ message: 'No products found' });
      }
  
      res.json({ message: 'Products fetched', products });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

const calculateEuclideanDistance = (lat1, lon1, lat2, lon2) => {
    if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
        return null; 
    }
    const x1 = lat1;
    const y1 = lon1;
    const x2 = lat2;
    const y2 = lon2;

    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

exports.getNearbyRiceMills = async (req, res) => {
    try {
        const buyerLocation = req.body.location; 
        
        if (!buyerLocation || buyerLocation.length !== 2) {
            return res.status(400).json({ error: "Invalid buyer location" });
        }

        const products = await Product.find({ isAvailable: true });

        const nearbyRiceMills = [];

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const sellerId = product.sellerId;

            const seller = await User.findById(sellerId);

            if (!seller || !seller.location || seller.location.length !== 2) {
                continue; 
            }

            const sellerLocation = seller.location; 

            const distance = calculateEuclideanDistance(buyerLocation[0], buyerLocation[1], sellerLocation[0], sellerLocation[1]);

            nearbyRiceMills.push({
                name: `${seller.riceMillName || 'Unknown'} Rice Mill #${i + 1}`,
                stock: product.quantity,
                priceWithCommission: product.pricePerTon * 1.05,
                transportCost: 'To be calculated',
                distance: distance, 
                sellerId: sellerId
            });
        }

        nearbyRiceMills.sort((a, b) => a.distance - b.distance);

        res.json({
            message: 'Nearby mills fetched',
            riceMills: nearbyRiceMills 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.placeBid = async (req, res) => {
    const { productId, bidPrice } = req.body;
    const buyerId = req.user.id;

    try {
        const product = await Product.findById(productId).populate('sellerId'); 
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const newBid = new Bid({
            productId,
            buyerId,
            bidPrice,
            status: 'pending' 
        });

        await newBid.save();

        if (bidPrice >= product.pricePerTon) {
            product.isAvailable = false; 
            await product.save();
            newBid.status = 'accepted'; 
            await newBid.save(); 

            return res.json({
                message: 'Bid auto-accepted',
                bid: newBid,
                productId: product._id,
                status: newBid.status, 
                sellerId: product.sellerId._id, 
                riceMillName: product.sellerId.riceMillName 
            });
        }

        console.log(`Bid placed for ₹${bidPrice}/ton on product ${productId}`);

        res.json({
            message: 'Bid placed successfully',
            bid: newBid,
            productId: product._id,
            status: newBid.status, 
            sellerId: product.sellerId._id,
            riceMillName: product.sellerId.riceMillName 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.proceedToPayment = async (req, res) => {
  const { bidId } = req.body; 
  try {
    const bid = await Bid.findById(bidId); 
    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    bid.status = 'completed'; 
    await bid.save(); 

    res.json({ message: 'Payment completed', bid }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📦 Order Summary
exports.getBidSummary = async (req, res) => {
    try {
      const buyerId = req.user.id;
  
      // Fetch only completed bids for the buyer
      const bids = await Bid.find({ buyerId, status: 'completed' })
        .populate('productId')
        .populate('buyerId');
      
      // Create and store the order details
      const orderDetails = await Promise.all(bids.map(async (bid) => {
        const product = bid.productId;
        const seller = await User.findById(product.sellerId);
        
        // Create a new order document and save it to the Order collection
        const newOrder = new Order({
          bidId: bid._id,
          productId: product._id,
          buyerId: buyerId,
          sellerId: seller._id,
          bidPrice: bid.bidPrice,
          quantity: product.quantity,
          productType: product.productType,
          riceMillName: product.riceMillName,
          createdAt: bid.createdAt
        });
  
        await newOrder.save(); // Save the order to the database
  
        // Return the order details to be displayed
        return {
          _id: newOrder._id,
          bidId: newOrder.bidId,
          productId: newOrder.productId,
          buyerId: newOrder.buyerId,
          sellerId: newOrder.sellerId,
          bidPrice: newOrder.bidPrice,
          quantity: newOrder.quantity,
          productType: newOrder.productType,
          status: newOrder.status,
          createdAt: newOrder.createdAt
        };
      }));
  
      res.json({
        message: 'Completed bid summary fetched and order stored successfully',
        orders: orderDetails
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.confirmDelivery = async (req, res) => {
    try {
      const { orderId } = req.body;
  
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      if (order.isDelivered) return res.status(400).json({ message: 'Delivered already' });
  
      order.isDelivered = true;
      await order.save();
  
      res.json({ message: 'Delivery Received successfully', orderId: order._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };