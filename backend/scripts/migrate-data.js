const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from parent directory since we're in scripts folder
console.log('Loading environment variables...');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Check for both possible variable names
const MONGO_URI = process.env.MONGO_URI || process.env.DBURL;

if (!MONGO_URI) {
  console.error('MongoDB URI not found in environment variables!');
  console.log('Checked for: MONGO_URI and DBURL');
  console.log('Available environment variables:');
  Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('DB')).forEach(key => {
    console.log(`  ${key}=`, process.env[key] ? 'SET' : 'NOT SET');
  });
  process.exit(1);
}

console.log('MongoDB URI found, connecting...');

// Import models from parent directory
const UserData = require('../models/UserData');
const User = require('../models/User');

// Connect directly to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const migrateData = async () => {
  try {
    console.log('Starting data migration...');
    
    // Connect to database
    await connectToMongoDB();

    // Get the first user (or create a default user for migration)
    let user = await User.findOne();
    if (!user) {
      console.log('No users found. Creating a default user for migration...');
      user = new User({
        name: 'Migration User',
        email: 'migration@example.com',
        password: 'tempPassword123',
        phone: '1234567890',
        gender: 'male',
        country: 'India',
        chapter: 'default',
        joinDate: new Date(),
        professionalName: 'Migration Professional',
        hobbies: 'Migration'
      });
      await user.save();
      console.log('Default user created:', user._id);
    } else {
      console.log('Using existing user:', user.name, user.email);
    }

    // Check if data already exists
    const existingCount = await UserData.countDocuments({ userId: user._id });
    console.log(`Existing records for user: ${existingCount}`);

    if (existingCount > 0) {
      console.log('User already has data. Skipping migration to avoid duplicates.');
      console.log('If you want to re-migrate, delete existing data first.');
      return;
    }

    // Migrate Business Opportunity Received Data (focus on your main issue)
    console.log('Migrating business opportunity received data...');
    const businessOpportunityReceivedData = [
      {
        id: 1,
        referralName: 'John Anderson',
        email: 'john.anderson@email.com',
        phone: '+1-555-0123',
        date: '2025-09-15',
        status: 'New',
        businessClosed: 'no'
      },
      {
        id: 2,
        referralName: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        phone: '+1-555-0456',
        date: '2025-09-18',
        status: 'In Progress',
        businessClosed: 'no'
      },
      {
        id: 3,
        referralName: 'Michael Chen',
        email: 'mchen@techcorp.com',
        phone: '+1-555-0789',
        date: '2025-09-20',
        status: 'Closed',
        businessClosed: 'yes'
      },
      {
        id: 4,
        referralName: 'Emily Rodriguez',
        email: 'emily.r@startup.io',
        phone: '+1-555-0321',
        date: '2025-09-22',
        status: 'New',
        businessClosed: 'no'
      },
      {
        id: 5,
        referralName: 'David Thompson',
        email: 'dthompson@consulting.com',
        phone: '+1-555-0654',
        date: '2025-09-23',
        status: 'In Progress',
        businessClosed: 'no'
      }
    ];

    for (const opportunity of businessOpportunityReceivedData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'business-opportunity-received',
        data: opportunity
      });
      await userData.save();
      console.log(`Created: ${opportunity.referralName}`);
    }

    console.log('Migration completed successfully!');
    console.log(`Total records migrated: ${businessOpportunityReceivedData.length}`);

    // Verify the data
    const verifyRecords = await UserData.find({ 
      userId: user._id, 
      sectionType: 'business-opportunity-received' 
    });
    console.log(`Verification: ${verifyRecords.length} records found in database`);

    console.log('\nNext steps:');
    console.log('1. Update your GET route to include userId filtering');
    console.log('2. Test your API endpoints');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

// Run migration
migrateData();