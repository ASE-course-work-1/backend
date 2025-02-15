import express from 'express';
import connectDB from './config/db.js';
import swaggerDocs from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import gasRequestRoutes from './routes/gasRequestRoutes.js';
import stockDeliveryRoutes from './routes/stockDeliveryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import outletRoutes from './routes/outletRoutes.js';
import cors from 'cors';
import morgan from 'morgan';
import { verifyToken } from './utils/authMiddleware.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', gasRequestRoutes);
app.use('/api/stock', stockDeliveryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/outlets', outletRoutes);

// Swagger Documentation
swaggerDocs(app);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on ${process.env.BASE_URL}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
}); 