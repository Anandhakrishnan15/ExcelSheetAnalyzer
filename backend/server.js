const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routers/authRoutes');
const getuserRouter = require ("./routers/getUserInfo")
const upload = require('./routers/upload')

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/Auth', authRoutes);
app.use("/api/users", getuserRouter )
app.use('/api/uploads', upload )


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
