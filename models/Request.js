import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  consumerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  outletId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Outlet',
    required: true 
  },
  token: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'scheduled', 'completed', 'canceled'],
    default: 'pending'
  },
  quantity: { 
    type: Number, 
    required: true,
    default: 1,
    min: 1,
    max: 2
  },
  address: {
    type: String,
    required: true
  },
  pickupDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

requestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Request', requestSchema); 