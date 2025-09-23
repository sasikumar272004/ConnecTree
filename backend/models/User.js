// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    // Basic Information - Required Fields
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    gender: { 
      type: String, 
      required: true, 
      enum: ['male', 'female', 'other', 'prefer-not-to-say'] 
    },
    country: { type: String, required: true, trim: true },
    chapter: { type: String, required: true, trim: true },
    joinDate: { type: Date, required: true },
    
    // Basic Information - Optional Fields
    dateOfBirth: { type: Date },
    streetAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    expectations: { type: String, trim: true },
    profilePhoto: {
      name: { type: String },
      size: { type: Number },
      type: { type: String },
      url: { type: String } // For storing uploaded file URL
    },

    // Business Information
    businessName: { type: String, trim: true },
    sponsorName: { type: String, trim: true },
    contactRole: { 
      type: String, 
      enum: ['ceo', 'founder', 'cto', 'manager', 'director', 'owner', 'other', ''],
      default: ''
    },
    gstNumber: { type: String, trim: true, uppercase: true },
    businessCategory: { 
      type: String,
      enum: ['technology', 'finance', 'healthcare', 'education', 'retail', 'manufacturing', 'services', ''],
      default: ''
    },
    establishedYear: { 
      type: Number,
      min: 1800,
      max: new Date().getFullYear()
    },
    companySize: { 
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-1000', '1000+', ''],
      default: ''
    },
    businessRegNumber: { type: String, trim: true },
    subCategory: { type: String, trim: true },
    headquarters: { type: String, trim: true },
    workPreference: { 
      type: String,
      enum: ['remote', 'onsite', 'hybrid', 'flexible', ''],
      default: ''
    },
    panNumber: { type: String, trim: true, uppercase: true },
    shortDescription: { type: String, trim: true },

    // Professional Information - Required Fields
    professionalName: { type: String, required: true, trim: true },
    
    // Professional Information - Optional Fields
    role: { type: String, trim: true },
    professionalCategory: { 
      type: String,
      enum: ['engineering', 'marketing', 'sales', 'finance', 'design', 'management', ''],
      default: ''
    },
    professionalWorkPreference: { 
      type: String,
      enum: ['remote', 'onsite', 'hybrid', 'flexible', 'contract', 'freelance', ''],
      default: ''
    },
    yearsExperience: { 
      type: String,
      enum: ['0-1', '1-3', '3-5', '5-10', '10-15', '15+', ''],
      default: ''
    },
    skillsTechnologies: { type: String, trim: true },

    // Social & Hobbies Information - Required Fields
    hobbies: { type: String, required: true, trim: true },
    
    // Social & Hobbies Information - Optional Fields
    socialName: { type: String, trim: true },
    socialCategory: { 
      type: String,
      enum: ['sports', 'arts', 'music', 'travel', 'food', 'reading', 'gaming', 'volunteering', 'networking', 'other', ''],
      default: ''
    },
    motivation: { type: String, trim: true },
    travelAvailable: { 
      type: String,
      enum: ['yes', 'sometimes', 'local-only', 'no', ''],
      default: ''
    },

    // Form Metadata
    registrationStep: { type: String, default: 'complete' },
    completedSteps: [{ type: Number }],
    formVersion: { type: String, default: '2.0' },
    
    // User Status
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    
    // Additional Metadata
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  { 
    timestamps: true,
    // Add indexes for better query performance
    indexes: [
      { email: 1 },
      { chapter: 1 },
      { businessCategory: 1 },
      { professionalCategory: 1 }
    ]
  }
);

// Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  // Only hash password if it's modified (or new)
  if (!this.isModified("password")) return next();
  
  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get public profile (excluding sensitive data)
UserSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.gstNumber;
  delete userObject.panNumber;
  delete userObject.businessRegNumber;
  delete userObject.ipAddress;
  delete userObject.userAgent;
  return userObject;
};

// Static method to find users by chapter
UserSchema.statics.findByChapter = function (chapter) {
  return this.find({ chapter: chapter, isActive: true });
};

// Static method to find users by business category
UserSchema.statics.findByBusinessCategory = function (category) {
  return this.find({ businessCategory: category, isActive: true });
};

module.exports = mongoose.model("User", UserSchema);