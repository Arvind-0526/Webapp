const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'nexerawe_journals';

const seedAdmin = async () => {
  try {
    await mongoose.connect(`${MONGO_URL}/${DB_NAME}`);

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@nexerawe.com' });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      console.log('Email: admin@nexerawe.com');
      console.log('You can use existing credentials to login');
    } else {
      // Create default admin
      const admin = new User({
        name: 'NexeraWe Admin',
        email: 'admin@nexerawe.com',
        password: 'admin123456',
        role: 'admin',
        agreementAccepted: true,
      });

      await admin.save();

      console.log('✅ Default admin user created successfully!');
      console.log('\n=================================');
      console.log('Admin Login Credentials:');
      console.log('=================================');
      console.log('Email: admin@nexerawe.com');
      console.log('Password: admin123456');
      console.log('=================================');
      console.log('\n⚠️  Please change the password after first login!');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();