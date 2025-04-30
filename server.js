// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const buyerRoutes = require('./routes/buyerRoutes')
const LorryRoutes = require('./routes/lorryRoutes')



dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/lorry', LorryRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
