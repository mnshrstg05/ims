const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// DB connection imports
const { connectToDatabase } = require('./config/dbConnection');





// Custom routes imports
const productRoutes = require('./routes/ProductRoutes');
const userRoutes = require('./routes/UserRoutes');
const categoryRoutes = require('./routes/CategoryRoutes'); 
const inventoryRoutes = require('./routes/InventoryRoutes'); 
const voucherRoutes = require('./routes/VoucherRoutes');
const authenticateUser = require('./middleware/authMiddleware');


const app = express();
const PORT = process.env.PORT || 5000;

const _dirname = path.resolve();


// Serve static files (images in the 'uploads' folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors({
    origin: 'https://ims-3cdk.onrender.com', // Replace with your actual frontend URL
    credentials: true
  }));
app.use(bodyParser.json());

connectToDatabase();

// Custom Routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);  
app.use('/inventory', inventoryRoutes); 
app.use('/vouchers', voucherRoutes); 

app.get('/auth/check', authenticateUser, (req, res) => {
    res.json({ authenticated: true, userId: req.userId });
  });

app.use(express.static(path.join(_dirname, "/frontend/build")));

app.get('*',(_,res)=>{
    res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"))
})

// Default route
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});




// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});