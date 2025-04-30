# Buyer, Seller, and Lorry Delivery App

This is a platform for managing product transactions between buyers and sellers, integrated with logistics for delivery. The app allows buyers to bid on products, sellers to list their products, and lorries (drivers) to accept orders for delivery. It also handles OTP verification for pickup and delivery confirmation by the buyer.

## Features

### Buyer App:
- **Search Products**: Search products by type and quantity.
- **Nearby Rice Mills**: Get a list of nearby rice mills, including stock and price with commission.
- **Place Bid**: Place a bid on a product. If the bid is higher than the listed price, it’s automatically accepted.
- **Bid Summary**: View all bids that are accepted and completed.
- **Payment**: Mark bid as completed once payment is made.
- **Delivery Confirmation**: Mark the order as "Delivered" after receiving the delivery.

### Seller App:
- **Add Product**: Sellers can add and manage products, mark them as available or unavailable.
- **Bid Management**: Sellers can view and manage bids, accepting those that meet the minimum price.
- **Order Summary**: See a list of completed orders and bid summaries.
- **Authentication**: All actions require authentication via Bearer token.

### Lorry App:
- **Register Lorry**: Register a lorry with name, vehicle number, and location.
- **Login Lorry**: Log in using the vehicle number.
- **Notify Lorry Drivers**: Notify the top 3 nearest lorries to a seller's location based on distance.
- **Accept Order**: Lorry drivers can accept orders and get order details, including the seller's name and rice mill name.
- **OTP Verification**: Verify OTP for confirming pickup and delivery.
- **Delivery Confirmation**: Confirm the delivery status once the delivery is completed.

## Models

- **User**: Contains buyer and seller registration details such as name, phone number, role, city, and location.
- **Product**: Seller's product information, including name, type, price, stock, and availability.
- **Bid**: Information related to bids placed by buyers, including bid price, status, and product details.
- **Order**: Contains order information such as order ID, bid ID, product ID, buyer and seller ID, and bid details.
- **Lorry**: Lorry driver details, including vehicle number, current location, and availability for orders.

## Technologies Used:

- **Node.js**: JavaScript runtime used for building the server-side application.
- **Express.js**: Web framework for Node.js to handle routing and middleware.
- **MongoDB**: NoSQL database to store user, product, bid, order, and lorry data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Token)**: Used for authentication via Bearer tokens to ensure secure access.
- **Postman**: Used for testing and API documentation.
- **Bcrypt.js**: For encrypting passwords during user authentication.
- **Cors**: A package to enable Cross-Origin Resource Sharing for allowing frontend access to backend.
- **dotenv**: Used for environment variable management (e.g., database connection strings).

## Setup

### Prerequisites:
- Node.js
- MongoDB

### Installation:
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/kuteeram_assign.git
    ```
2. Install required dependencies:
    ```bash
    npm install
    ```

3. Set up your MongoDB database and add the required environment variables in a `.env` file:
    ```
    MONGO_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    ```

4. Start the server:
    ```bash
    node server.js
    ```
