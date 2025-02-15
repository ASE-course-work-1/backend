import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  outletId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Outlet',
    required: true 
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
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
  if (!this.requestId) {
    return next(new Error('Delivery must be associated with a request'));
  }
  this.updatedAt = Date.now();
  next();
});

deliverySchema.index({ outletId: 1, requestId: 1 }, { unique: true });

export default mongoose.model('Delivery', deliverySchema); 