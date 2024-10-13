require('dotenv').config();
const express = require('express');
require('./db/db');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());



// Import routes
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const wasteManagementRouter = require('./routes/wasteManagement');
const collectionRouter = require('./routes/collection');

// Use the routes
app.use(authRouter);
app.use(profileRouter);
app.use(wasteManagementRouter);
app.use(collectionRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
