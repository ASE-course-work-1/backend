import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  nic: { type: String, required: true, unique: true },
  role: { type: String, enum: ['consumer', 'outlet_manager', 'admin'], default: 'consumer' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  verificationOTP: Number,
  otpExpires: Date
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('User', userSchema); 