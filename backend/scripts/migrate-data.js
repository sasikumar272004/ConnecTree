const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const UserData = require('../models/UserData');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const migrateData = async () => {
  try {
    console.log('Starting data migration...');

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
    }

    // Migrate Connections Data
    console.log('Migrating connections data...');
    const connectionsData = [
      {
        id: 1,
        name: 'Clark Ron',
        title: 'Legal & Accounting | Tax Advisor',
        company: 'TEAM ABC',
        avatar: '/api/placeholder/60/60',
        status: 'connected',
        location: 'New York, NY'
      },
      {
        id: 2,
        name: 'Olivia',
        title: 'Health & Wellness | Dentist',
        company: 'TEAM ABC',
        avatar: '/api/placeholder/60/60',
        status: 'connected',
        location: 'Los Angeles, CA'
      },
      {
        id: 3,
        name: 'Peter Hen',
        title: 'Vice President',
        company: 'TEAM ABC',
        avatar: '/api/placeholder/60/60',
        status: 'connected',
        location: 'Chicago, IL'
      },
      {
        id: 4,
        name: 'Emma John',
        title: 'Director',
        company: 'TEAM ABC',
        avatar: '/api/placeholder/60/60',
        status: 'connected',
        location: 'Miami, FL'
      },
      {
        id: 5,
        name: 'Mark Luce',
        title: 'Financial Head',
        company: 'TEAM ABC',
        avatar: '/api/placeholder/60/60',
        status: 'connected',
        location: 'Seattle, WA'
      },
      {
        id: 6,
        name: 'Isabella',
        title: 'Training & Coaching | Education',
        company: 'TEAM ABC',
        avatar: '/api/placeholder/60/60',
        status: 'connected',
        location: 'Austin, TX'
      }
    ];

    for (const connection of connectionsData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'connections',
        data: connection
      });
      await userData.save();
    }

    // Migrate Testimonials Data
    console.log('Migrating testimonials data...');
    const testimonialsData = [
      {
        id: 1,
        name: 'Clark Ron',
        avatar: '/api/placeholder/60/60',
        role: 'Tax Advisor',
        company: 'TEAM ABC',
        testimonial: 'Working with Mark has been an absolute pleasure. His vision, dedication, and innovative approach to business are truly inspiring. He not only delivers results but also builds strong trustworthy relationships with clients and partners.',
        date: '2 weeks ago',
        rating: 5,
        type: 'received'
      },
      {
        id: 2,
        name: 'Olivia',
        avatar: '/api/placeholder/60/60',
        role: 'Dentist',
        company: 'TEAM ABC',
        testimonial: 'Mark\'s professional expertise and collaborative spirit make him an exceptional business partner. His ability to understand complex requirements and deliver innovative solutions consistently exceeds expectations.',
        date: '1 month ago',
        rating: 5,
        type: 'received'
      },
      {
        id: 3,
        name: 'John Smith',
        avatar: '/api/placeholder/60/60',
        role: 'Business Partner',
        company: 'Tech Solutions Inc',
        testimonial: 'Excellent collaboration and professional service. Highly recommended for any business partnership.',
        date: '3 weeks ago',
        rating: 5,
        type: 'given'
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        avatar: '/api/placeholder/60/60',
        role: 'Marketing Director',
        company: 'Marketing Pro',
        testimonial: 'Outstanding work ethic and business acumen. Looking forward to future collaborations.',
        date: '1 week ago',
        rating: 4,
        type: 'given'
      },
      {
        id: 5,
        name: 'Mike Johnson',
        avatar: '/api/placeholder/60/60',
        role: 'CEO',
        company: 'StartupXYZ',
        testimonial: 'Requesting testimonial for our recent collaboration project.',
        date: '2 days ago',
        rating: 0,
        type: 'request'
      }
    ];

    for (const testimonial of testimonialsData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'testimonials',
        data: testimonial
      });
      await userData.save();
    }

    // Migrate P2P Data
    console.log('Migrating P2P data...');
    const p2pData = [
      {
        id: 1,
        date: '10/08/2025',
        meetWith: 'David',
        initiatedBy: 'Mike',
        location: 'Office',
        topics: 'Discussed about each other\'s businesses and future collaboration...',
        status: 'Completed'
      },
      {
        id: 2,
        date: '19/08/2025',
        meetWith: 'Phillips',
        initiatedBy: 'John',
        location: 'Cafe',
        topics: 'Business discuss',
        status: 'Completed'
      }
    ];

    for (const p2p of p2pData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'p2p',
        data: p2p
      });
      await userData.save();
    }

    // Migrate Business Opportunity Received Data
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
    }

    // Migrate Business Opportunity Given Data
    console.log('Migrating business opportunity given data...');
    const businessOpportunityGivenData = [
      {
        id: 1,
        date: '2025-09-16',
        to: 'David Smith',
        referral: 'Tech Solutions Inc',
        email: 'contact@techsolutions.com',
        phone: '+1-555-2345',
        type: 'Direct',
        referralStatus: 'Completed',
        comments: 'Successfully connected for software development project',
        status: 'Active'
      },
      {
        id: 2,
        date: '2025-09-19',
        to: 'Phillips Johnson',
        referral: 'Marketing Pro Agency',
        email: 'info@marketingpro.com',
        phone: '+1-555-6789',
        type: 'Indirect',
        referralStatus: 'In Progress',
        comments: 'Initial meeting scheduled for next week',
        status: 'Active'
      },
      {
        id: 3,
        date: '2025-09-21',
        to: 'Mike Williams',
        referral: 'Finance Experts LLC',
        email: 'hello@financeexperts.com',
        phone: '+1-555-9876',
        type: 'Consultation',
        referralStatus: 'Pending',
        comments: 'Waiting for client response on consultation proposal',
        status: 'Active'
      }
    ];

    for (const opportunity of businessOpportunityGivenData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'business-opportunity-given',
        data: opportunity
      });
      await userData.save();
    }

    // Migrate Business Closed Data
    console.log('Migrating business closed data...');
    const businessClosedData = [
      {
        id: 1,
        date: '2025-09-15',
        to: 'David Smith',
        amount: '25000',
        businessType: 'Consulting',
        referralType: 'Direct Referral',
        comments: 'Successfully closed consulting project for new client',
        status: 'Completed'
      },
      {
        id: 2,
        date: '2025-09-18',
        to: 'Phillips Johnson',
        amount: '45000',
        businessType: 'Software Development',
        referralType: 'Indirect Referral',
        comments: 'Web development project completed on time',
        status: 'Completed'
      },
      {
        id: 3,
        date: '2025-09-20',
        to: 'Mike Williams',
        amount: '18500',
        businessType: 'Marketing Services',
        referralType: 'Direct Referral',
        comments: 'Digital marketing campaign delivered excellent results',
        status: 'Completed'
      },
      {
        id: 4,
        date: '2025-09-22',
        to: 'David Smith',
        amount: '32000',
        businessType: 'Real Estate',
        referralType: 'Self Generated',
        comments: 'Property sale commission received',
        status: 'In Progress'
      },
      {
        id: 5,
        date: '2025-09-23',
        to: 'Phillips Johnson',
        amount: '15000',
        businessType: 'Finance',
        referralType: 'Indirect Referral',
        comments: 'Financial planning services for corporate client',
        status: 'Completed'
      }
    ];

    for (const business of businessClosedData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'business-closed',
        data: business
      });
      await userData.save();
    }

    // Migrate Meetings Data
    console.log('Migrating meetings data...');
    const meetingsData = [
      {
        id: 1,
        meetingDate: '2025-09-25',
        enteredBy: 'David Smith',
        enteredDate: '2025-09-20',
        status: 'Scheduled',
        details: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Anderson',
            palms: '5',
            rgi: '3',
            rgo: '2',
            pri: '4',
            rro: '1',
            visitors: '2',
            oneToOne: '3',
            tqGiven: '7',
            testimonials: '2'
          },
          {
            id: 2,
            firstName: 'Sarah',
            lastName: 'Wilson',
            palms: '8',
            rgi: '6',
            rgo: '4',
            pri: '3',
            rro: '2',
            visitors: '1',
            oneToOne: '5',
            tqGiven: '9',
            testimonials: '3'
          },
          {
            id: 3,
            firstName: 'Michael',
            lastName: 'Chen',
            palms: '12',
            rgi: '8',
            rgo: '6',
            pri: '7',
            rro: '3',
            visitors: '4',
            oneToOne: '8',
            tqGiven: '15',
            testimonials: '5'
          }
        ]
      },
      {
        id: 2,
        meetingDate: '2025-09-18',
        enteredBy: 'Phillips Johnson',
        enteredDate: '2025-09-15',
        status: 'Completed',
        details: [
          {
            id: 1,
            firstName: 'Emily',
            lastName: 'Rodriguez',
            palms: '6',
            rgi: '4',
            rgo: '3',
            pri: '2',
            rro: '1',
            visitors: '1',
            oneToOne: '4',
            tqGiven: '8',
            testimonials: '2'
          },
          {
            id: 2,
            firstName: 'David',
            lastName: 'Thompson',
            palms: '10',
            rgi: '7',
            rgo: '5',
            pri: '6',
            rro: '4',
            visitors: '3',
            oneToOne: '6',
            tqGiven: '12',
            testimonials: '4'
          }
        ]
      }
    ];

    for (const meeting of meetingsData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'meetings',
        data: meeting
      });
      await userData.save();
    }

    // Migrate Visitors Data
    console.log('Migrating visitors data...');
    const visitorsData = [
      {
        id: 1,
        visitorName: 'David Johnson',
        email: 'david66@gmail.com',
        phone: '9988776655',
        visitDate: '2025-09-24',
        companyName: 'NC Limited',
        registrationType: 'visitor',
        registrationChapter: 'ekam-iconic',
        firstName: 'David',
        lastName: 'Johnson',
        category: 'advertising-agency',
        streetAddress: '1266, KPHB Phase 1',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500072',
        country: 'India'
      },
      {
        id: 2,
        visitorName: 'Sarah Wilson',
        email: 'sarah.w@company.com',
        phone: '9876543210',
        visitDate: '2025-09-26',
        companyName: 'Tech Solutions',
        registrationType: 'guest',
        registrationChapter: 'ekam-elite',
        firstName: 'Sarah',
        lastName: 'Wilson',
        category: 'technology',
        streetAddress: '456 Tech Park',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    ];

    for (const visitor of visitorsData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'visitors',
        data: visitor
      });
      await userData.save();
    }

    // Migrate My Feeds Data
    console.log('Migrating my feeds data...');
    const myFeedsData = [
      {
        id: 1,
        title: 'Networking Success Story',
        content: 'Great networking event last week. Met amazing professionals and made valuable connections.',
        author: 'John Smith',
        publishDate: '2025-09-20',
        category: 'networking',
        status: 'Published'
      },
      {
        id: 2,
        title: 'Business Opportunity Alert',
        content: 'New business opportunities available in tech sector. Interested members please reach out.',
        author: 'Jane Doe',
        publishDate: '2025-09-22',
        category: 'business',
        status: 'Published'
      }
    ];

    for (const feed of myFeedsData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'my-feeds',
        data: feed
      });
      await userData.save();
    }

    // Migrate Upcoming Events Data
    console.log('Migrating upcoming events data...');
    const upcomingEventsData = [
      {
        id: 1,
        eventName: 'Networking Breakfast',
        startDateTime: '2025-09-25 08:00 AM',
        location: 'Conference Hall A'
      },
      {
        id: 2,
        eventName: 'Business Workshop',
        startDateTime: '2025-09-28 02:00 PM',
        location: 'Training Center'
      },
      {
        id: 3,
        eventName: 'Annual Meeting',
        startDateTime: '2025-10-05 10:00 AM',
        location: 'Main Auditorium'
      }
    ];

    for (const event of upcomingEventsData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'upcoming-events',
        data: event
      });
      await userData.save();
    }

    // Migrate One to Many Data
    console.log('Migrating one to many data...');
    const oneToManyData = [
      {
        id: 1,
        meetingDate: '2025-09-25',
        enteredBy: 'David Smith',
        enteredDate: '2025-09-20',
        status: 'Scheduled'
      },
      {
        id: 2,
        meetingDate: '2025-09-18',
        enteredBy: 'Phillips Johnson',
        enteredDate: '2025-09-15',
        status: 'Completed'
      },
      {
        id: 3,
        meetingDate: '2025-09-30',
        enteredBy: 'Mike Williams',
        enteredDate: '2025-09-22',
        status: 'Scheduled'
      }
    ];

    for (const meeting of oneToManyData) {
      const userData = new UserData({
        userId: user._id,
        sectionType: 'one-to-many',
        data: meeting
      });
      await userData.save();
    }

    console.log('Migration completed successfully!');
    console.log(`Total records migrated: ${await UserData.countDocuments()}`);

    // Close the connection
    mongoose.connection.close();

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrateData();
