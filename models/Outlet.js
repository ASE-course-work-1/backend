import mongoose from 'mongoose';

const outletSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  district: { type: String, required: true },
  contact: { type: String, required: true },
  manager: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  capacity: { type: Number, required: true },
  currentStock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

outletSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Outlet', outletSchema); 