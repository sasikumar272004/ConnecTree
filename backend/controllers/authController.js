const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Blacklist = require("../models/blacklist");
const path = require("path");
const fs = require("fs");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register a new user - UPDATED WITH IMAGE UPLOAD
// Register a new user - COMPLETE FIXED VERSION
exports.registerUser = async (req, res) => {
  try {
    console.log('Registration request received');
    console.log('File:', req.file);
    console.log('Body keys:', Object.keys(req.body));

    // Handle uploaded file - FIXED: Create proper URL
    let profilePhotoUrl = null;
    if (req.file) {
      // Create proper URL that frontend can access
      profilePhotoUrl = `/uploads/images/${req.file.filename}`;
      console.log('Profile photo URL:', profilePhotoUrl);
    }

    // Destructure all fields from request body
    const {
      // Basic Information - Required
      name, email, password, phone, gender, country, chapter, joinDate,
      
      // Basic Information - Optional
      dateOfBirth, streetAddress, city, state, pincode, expectations,
      
      // Business Information
      businessName, sponsorName, contactRole, gstNumber, businessCategory,
      establishedYear, companySize, businessRegNumber, subCategory,
      headquarters, workPreference, panNumber, shortDescription,
      
      // Professional Information - Required
      professionalName,
      
      // Professional Information - Optional
      role, professionalCategory, professionalWorkPreference,
      yearsExperience, skillsTechnologies,
      
      // Social & Hobbies Information - Required
      hobbies,
      
      // Social & Hobbies Information - Optional
      socialName, socialCategory, motivation, travelAvailable,
      
      // Form Metadata
      registrationStep, completedSteps, formVersion
    } = req.body;

    // Validate required fields
    const requiredFields = {
      name: name,
      email: email,
      password: password || "connecttree",
      phone: phone,
      gender: gender,
      country: country,
      chapter: chapter,
      joinDate: joinDate,
      professionalName: professionalName,
      hobbies: hobbies
    };

    // Check for missing required fields
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.toString().trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      // Clean up uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: "Missing required fields", 
        missingFields: missingFields 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // Clean up uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password length
    const actualPassword = password || "connecttree";
    if (actualPassword.length < 6) {
      // Clean up uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Validate phone number format
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      // Clean up uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // Clean up uploaded file if user exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Check for duplicate phone
    const existingPhone = await User.findOne({ phone: phone });
    if (existingPhone) {
      // Clean up uploaded file if phone exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // Create user object with all fields
    const userData = {
      // Basic Information
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: actualPassword,
      phone: phone.trim(),
      gender: gender,
      country: country,
      chapter: chapter,
      joinDate: new Date(joinDate),
      
      // Optional Basic Information
      ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
      ...(streetAddress && { streetAddress: streetAddress.trim() }),
      ...(city && { city: city.trim() }),
      ...(state && { state: state.trim() }),
      ...(pincode && { pincode: pincode.trim() }),
      ...(expectations && { expectations: expectations.trim() }),
      
      // FIXED: Store proper profile photo structure
      ...(profilePhotoUrl && { 
        profilePhoto: {
          name: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype,
          url: profilePhotoUrl
        }
      }),
      
      // Business Information
      ...(businessName && { businessName: businessName.trim() }),
      ...(sponsorName && { sponsorName: sponsorName.trim() }),
      ...(contactRole && { contactRole: contactRole }),
      ...(gstNumber && { gstNumber: gstNumber.trim().toUpperCase() }),
      ...(businessCategory && { businessCategory: businessCategory }),
      ...(establishedYear && { establishedYear: parseInt(establishedYear) }),
      ...(companySize && { companySize: companySize }),
      ...(businessRegNumber && { businessRegNumber: businessRegNumber.trim() }),
      ...(subCategory && { subCategory: subCategory.trim() }),
      ...(headquarters && { headquarters: headquarters.trim() }),
      ...(workPreference && { workPreference: workPreference }),
      ...(panNumber && { panNumber: panNumber.trim().toUpperCase() }),
      ...(shortDescription && { shortDescription: shortDescription.trim() }),
      
      // Professional Information
      professionalName: professionalName.trim(),
      ...(role && { role: role.trim() }),
      ...(professionalCategory && { professionalCategory: professionalCategory }),
      ...(professionalWorkPreference && { professionalWorkPreference: professionalWorkPreference }),
      ...(yearsExperience && { yearsExperience: yearsExperience }),
      ...(skillsTechnologies && { skillsTechnologies: skillsTechnologies.trim() }),
      
      // Social & Hobbies Information
      hobbies: hobbies.trim(),
      ...(socialName && { socialName: socialName.trim() }),
      ...(socialCategory && { socialCategory: socialCategory }),
      ...(motivation && { motivation: motivation.trim() }),
      ...(travelAvailable && { travelAvailable: travelAvailable }),
      
      // Form Metadata
      registrationStep: registrationStep || 'complete',
      completedSteps: completedSteps || [0, 1, 2, 3],
      formVersion: formVersion || '2.0',
      
      // Additional metadata
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    // Create and save user
    const user = new User(userData);
    await user.save();

    console.log(`New user registered: ${email} - Chapter: ${chapter}`);
    if (profilePhotoUrl) {
      console.log(`Profile photo URL: ${profilePhotoUrl}`);
    }

    // Generate token
    const token = generateToken(user._id);

    // Return success response with public profile
    const publicProfile = user.getPublicProfile();

    // FIXED: Return proper response with image URL
    res.status(201).json({ 
      message: "User registered successfully",
      user: publicProfile,
      token: token,
      completedSteps: completedSteps || [0, 1, 2, 3],
      imageUrl: profilePhotoUrl, // This will be saved to localStorage
      success: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Clean up uploaded file if there's an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors,
        success: false
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        message: `${field} already exists`,
        success: false
      });
    }
    
    res.status(500).json({ 
      message: "Registration failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      success: false
    });
  }
};

// Login a user - UNCHANGED (works with expanded model)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Use the matchPassword method from the model
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return public profile
    const publicProfile = user.getPublicProfile();

    res.status(200).json({ 
      message: "Logged in successfully", 
      token, 
      user: publicProfile 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Logout a user - UNCHANGED
exports.logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Check if token is already blacklisted
    const existingToken = await Blacklist.findOne({ token });
    if (existingToken) {
      return res.status(200).json({ message: "Already logged out" });
    }

    // Blacklist the token
    await Blacklist.create({ token });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user profile - ENHANCED to return full profile with image URL
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return public profile (password and sensitive data excluded)
    const publicProfile = user.getPublicProfile();

    // Add profile photo URL if exists
    if (user.profilePhoto) {
      publicProfile.profilePhotoUrl = `/uploads/images/${path.basename(user.profilePhoto)}`;
    }

    res.status(200).json(publicProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};