const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: "55mb" }));
app.use(express.urlencoded({ limit: "55mb", extended: true })); // Use 'extended: true' here
app.use(cookieParser());
const allowedOrigins = ['http://localhost:5173']; // Add your frontend origin here

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

const uploadImage = require("./utils/uploadimage");




// MongoDB Connection
async function main() {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("MongoDb successfully connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit on connection failure
  }
}

main();



const productRoutes = require('./src/product/product.route'); 

const userRoutes = require('./src/users/user.route');

const formRoutes = require("./src/form/form.route"); 

const reviewRoutes = require("./src/review/review.route"); 

const orderRoutes = require("./src/order/order.route");




app.use('/api/users', userRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/api/products', productRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/orders", orderRoutes);

app.post("/api/uploadImage", (req, res) => {
  const { image } = req.body;
  if (!image) {
      return res.status(400).json({ error: "Image data is required" });
  }
  uploadImage(image)
      .then((response) => res.status(200).json(response))
      .catch((err) => res.status(500).json({ error: "Image upload failed", details: err }));
});






// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Start Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
