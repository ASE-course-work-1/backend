import mongoose from 'mongoose';
import User from '../models/User.js';
import Outlet from '../models/Outlet.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@gasbygas.com' });
    
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@gasbygas.com'.toLowerCase(),
        password: adminPassword,
        phone: '0712345678',
        nic: '200012345678',
        role: 'admin',
        isVerified: true
      });
      
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await seedAdmin();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase(); 