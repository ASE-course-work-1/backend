import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  outletId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Outlet',
    required: true 
  },
  scheduledDate: { type: Date, required: true },
  confirmedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  status: {
    type: String,
    enum: ['scheduled', 'delivered', 'canceled'],
    default: 'scheduled'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

deliverySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Delivery', deliverySchema); 