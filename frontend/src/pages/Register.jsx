import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import {
  FaUser, FaEnvelope, FaLock, FaArrowRight, FaPhone, FaMapMarkerAlt,
  FaBriefcase, FaGraduationCap, FaHeart, FaCalendarAlt, FaUpload,
  FaBuilding, FaIdCard, FaFlag, FaTrash
} from "react-icons/fa";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    // Basic Info
    name: "", email: "", password: "", phone: "", gender: "", dateOfBirth: "",
    streetAddress: "", city: "", state: "", pincode: "", country: "",
    chapter: "", joinDate: "", expectations: "", profilePhoto: null,
    
    // Business
    businessName: "", sponsorName: "", contactRole: "", gstNumber: "",
    businessCategory: "", establishedYear: "", companySize: "", businessRegNumber: "",
    subCategory: "", headquarters: "", workPreference: "", panNumber: "", shortDescription: "",
    
    // Professional
    profName: "", role: "", profCategory: "", profWorkPreference: "", yearsExperience: "", skillsTech: "",
    
    // Social & Hobbies
    socialName: "", socialCategory: "", hobbies: "", motivation: "", travelAvailable: ""
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const steps = [
    { id: 'basic', title: 'Basic Info', icon: <FaUser className="w-5 h-5" /> },
    { id: 'business', title: 'Business', icon: <FaBriefcase className="w-5 h-5" /> },
    { id: 'professional', title: 'Professional', icon: <FaGraduationCap className="w-5 h-5" /> },
    { id: 'social', title: 'Social & Hobbies', icon: <FaHeart className="w-5 h-5" /> }
  ];

  // Business categories with subcategories
  const businessCategories = {
    "": [],
    "technology": ["Software Development", "Hardware", "AI/ML", "Cybersecurity", "Cloud Services"],
    "finance": ["Banking", "Investment", "Insurance", "Fintech", "Accounting"],
    "healthcare": ["Hospitals", "Pharmaceuticals", "Medical Devices", "Telemedicine", "Healthcare IT"],
    "education": ["K-12 Education", "Higher Education", "Online Learning", "Training", "EdTech"],
    "retail": ["E-commerce", "Fashion", "Electronics", "Home & Garden", "Automotive"],
    "manufacturing": ["Automotive", "Textiles", "Food Processing", "Chemicals", "Electronics"],
    "services": ["Consulting", "Legal", "Marketing", "HR Services", "Logistics"]
  };

  const professionalCategories = {
    "": [],
    "engineering": ["Software Engineering", "Mechanical", "Electrical", "Civil", "Chemical"],
    "marketing": ["Digital Marketing", "Content Marketing", "Brand Management", "SEO/SEM", "Social Media"],
    "sales": ["B2B Sales", "Retail Sales", "Account Management", "Business Development", "Sales Operations"],
    "finance": ["Financial Analysis", "Accounting", "Investment Banking", "Risk Management", "Audit"],
    "design": ["UI/UX Design", "Graphic Design", "Product Design", "Interior Design", "Industrial Design"],
    "management": ["Project Management", "Operations", "Strategy", "HR Management", "General Management"]
  };

  const skillsOptions = [
    "JavaScript", "Python", "React", "Node.js", "Angular", "Vue.js", "Java", "C++",
    "SQL", "MongoDB", "AWS", "Azure", "Docker", "Kubernetes", "Git", "Agile",
    "Project Management", "Leadership", "Communication", "Problem Solving"
  ];

  // Load saved data from memory storage on component mount
  useEffect(() => {
    // Note: Using memory storage instead of localStorage for Claude.ai compatibility
    const savedData = window.registrationData;
    if (savedData) {
      setFormData(savedData.formData || formData);
      setCurrentStep(savedData.currentStep || 0);
      setCompletedSteps(savedData.completedSteps || []);
    }
  }, []);

  const saveToStorage = (data) => {
    // Using window object for memory storage
    window.registrationData = data;
  };

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    saveToStorage({
      formData: newFormData,
      currentStep,
      completedSteps
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF)");
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size should be less than 5MB");
        return;
      }

      const newFormData = { ...formData, profilePhoto: file };
      setFormData(newFormData);
      saveToStorage({
        formData: newFormData,
        currentStep,
        completedSteps
      });
      toast.success("Profile photo uploaded successfully!");
    }
  };

  const removeFile = () => {
    const newFormData = { ...formData, profilePhoto: null };
    setFormData(newFormData);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    saveToStorage({
      formData: newFormData,
      currentStep,
      completedSteps
    });
    toast.info("Profile photo removed");
  };

  const handleBusinessCategoryChange = (e) => {
    const category = e.target.value;
    const newFormData = { 
      ...formData, 
      businessCategory: category,
      subCategory: "" // Reset subcategory when main category changes
    };
    setFormData(newFormData);
    saveToStorage({
      formData: newFormData,
      currentStep,
      completedSteps
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const newCompleted = [...completedSteps];
      if (!newCompleted.includes(currentStep)) {
        newCompleted.push(currentStep);
        setCompletedSteps(newCompleted);
      }
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      saveToStorage({
        formData,
        currentStep: newStep,
        completedSteps: newCompleted
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      saveToStorage({
        formData,
        currentStep: newStep,
        completedSteps
      });
    }
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the entire form? All your progress will be lost."
    );
    
    if (confirmReset) {
      const initialFormData = {
        name: "", email: "", password: "", phone: "", gender: "", dateOfBirth: "",
        streetAddress: "", city: "", state: "", pincode: "", country: "",
        chapter: "", joinDate: "", expectations: "", profilePhoto: null,
        businessName: "", sponsorName: "", contactRole: "", gstNumber: "",
        businessCategory: "", establishedYear: "", companySize: "", businessRegNumber: "",
        subCategory: "", headquarters: "", workPreference: "", panNumber: "", shortDescription: "",
        profName: "", role: "", profCategory: "", profWorkPreference: "", yearsExperience: "", skillsTech: "",
        socialName: "", socialCategory: "", hobbies: "", motivation: "", travelAvailable: ""
      };

      setFormData(initialFormData);
      setCurrentStep(0);
      setCompletedSteps([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Clear storage
      delete window.registrationData;
      toast.success("Form has been reset successfully!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Define all required fields with clear validation
    const requiredFields = {
      // Basic Info - Required fields
      name: { value: formData.name, label: "Full Name" },
      email: { value: formData.email, label: "Email Address" },
      password: { value: "connecttree", label: "Password" },
      phone: { value: formData.phone, label: "Phone Number" },
      gender: { value: formData.gender, label: "Gender" },
      country: { value: formData.country, label: "Country" },
      chapter: { value: formData.chapter, label: "Chapter" },
      joinDate: { value: formData.joinDate, label: "Join Date" },
      // Professional - Required fields
      profName: { value: formData.profName, label: "Professional Name" },
      // Social - Required fields
      hobbies: { value: formData.hobbies, label: "Hobbies" }
    };

    // Check for missing required fields
    const missingFields = Object.entries(requiredFields)
      .filter(([key, field]) => !field.value || field.value.toString().trim() === '')
      .map(([key, field]) => field.label);

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    // Additional validation for specific fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      toast.error("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      // Prepare comprehensive payload with ALL form data
      const registrationPayload = {
        // Basic Information
        name: formData.name || "",
        email: formData.email || "",
        password: formData.password || "",
        phone: formData.phone || "",
        gender: formData.gender || "",
        dateOfBirth: formData.dateOfBirth || "",
        streetAddress: formData.streetAddress || "",
        city: formData.city || "",
        state: formData.state || "",
        pincode: formData.pincode || "",
        country: formData.country || "",
        chapter: formData.chapter || "",
        joinDate: formData.joinDate || "",
        expectations: formData.expectations || "",
        profilePhoto: formData.profilePhoto ? {
          name: formData.profilePhoto.name,
          size: formData.profilePhoto.size,
          type: formData.profilePhoto.type
        } : null,

        // Business Information
        businessName: formData.businessName || "",
        sponsorName: formData.sponsorName || "",
        contactRole: formData.contactRole || "",
        gstNumber: formData.gstNumber || "",
        businessCategory: formData.businessCategory || "",
        establishedYear: formData.establishedYear || "",
        companySize: formData.companySize || "",
        businessRegNumber: formData.businessRegNumber || "",
        subCategory: formData.subCategory || "",
        headquarters: formData.headquarters || "",
        workPreference: formData.workPreference || "",
        panNumber: formData.panNumber || "",
        shortDescription: formData.shortDescription || "",

        // Professional Information
        professionalName: formData.profName || "",
        role: formData.role || "",
        professionalCategory: formData.profCategory || "",
        professionalWorkPreference: formData.profWorkPreference || "",
        yearsExperience: formData.yearsExperience || "",
        skillsTechnologies: formData.skillsTech || "",

        // Social & Hobbies Information
        socialName: formData.socialName || "",
        socialCategory: formData.socialCategory || "",
        hobbies: formData.hobbies || "",
        motivation: formData.motivation || "",
        travelAvailable: formData.travelAvailable || "",

        // Form metadata
        registrationStep: 'complete',
        completedSteps: completedSteps,
        submittedAt: new Date().toISOString(),
        formVersion: "2.0"
      };

      console.log('Sending complete registration payload:', registrationPayload);
      console.log('Total fields being sent:', Object.keys(registrationPayload).length);

      // Real API call - replace with your actual endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        registrationPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const { token, user } = response.data;

      // Store authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setSuccess(true);
      toast.success("Registration successful! Welcome to Ekam Global Network!");
      
      // Clear form data on successful submission
      delete window.registrationData;
      setTimeout(() => navigate("/Home"), 2000);

    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.message || 
                           err.response.data?.error || 
                           `Registration failed (${err.response.status})`;
        toast.error(errorMessage);
        console.error('Server Error:', err.response.data);
      } else if (err.request) {
        // Request made but no response received
        toast.error("Network error. Please check your connection and try again.");
        console.error('Network Error:', err.request);
      } else {
        // Something else happened
        toast.error("An unexpected error occurred during registration.");
        console.error('Error:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Your full name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Phone number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter Phone number"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Email address <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
        </div>
      </div>

    

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Gender <span className="text-red-500">*</span></label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Date of birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Upload profile Photo</label>
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div 
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-gray-400 flex items-center justify-between cursor-pointer hover:border-orange-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex items-center space-x-2">
                <FaUpload className="text-orange-400" />
                <span>{formData.profilePhoto ? formData.profilePhoto.name : "Choose File"}</span>
              </div>
              {formData.profilePhoto && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <FaTrash />
                </button>
              )}
            </div>
            {formData.profilePhoto && (
              <div className="mt-2 text-sm text-green-400">
                File size: {(formData.profilePhoto.size / 1024).toFixed(1)} KB
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Street Address</label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            placeholder="Enter Street Address"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter City"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter State"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Country <span className="text-red-500">*</span></label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            required
          >
            <option value="">Select Country</option>
            <option value="india">India</option>
            <option value="usa">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="canada">Canada</option>
            <option value="australia">Australia</option>
            <option value="germany">Germany</option>
            <option value="france">France</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">When do you plan to join? <span className="text-red-500">*</span></label>
          <input
            type="date"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Which chapter are you registering for? <span className="text-red-500">*</span></label>
          <select
            name="chapter"
            value={formData.chapter}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            required
          >
            <option value="">Select your chapter</option>
            <option value="mumbai">Mumbai Chapter</option>
            <option value="delhi">Delhi Chapter</option>
            <option value="bangalore">Bangalore Chapter</option>
            <option value="pune">Pune Chapter</option>
            <option value="hyderabad">Hyderabad Chapter</option>
            <option value="chennai">Chennai Chapter</option>
            <option value="kolkata">Kolkata Chapter</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Please let us know what you expect from Ekam</label>
          <textarea
            name="expectations"
            value={formData.expectations}
            onChange={handleChange}
            placeholder="Enter your expectations"
            rows="1"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderBusinessInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter business Name"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Business Category</label>
          <select
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleBusinessCategoryChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Category</option>
            {Object.keys(businessCategories).filter(key => key !== "").map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Sub-category</label>
          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            disabled={!formData.businessCategory}
          >
            <option value="">Select Sub-category</option>
            {formData.businessCategory && businessCategories[formData.businessCategory]?.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Sponsor Name | Write Self if referred by none</label>
          <input
            type="text"
            name="sponsorName"
            value={formData.sponsorName}
            onChange={handleChange}
            placeholder="Enter sponsor name"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Established Year</label>
          <input
            type="number"
            name="establishedYear"
            value={formData.establishedYear}
            onChange={handleChange}
            placeholder="Enter Established Year"
            min="1800"
            max={new Date().getFullYear()}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Headquarters Location</label>
          <input
            type="text"
            name="headquarters"
            value={formData.headquarters}
            onChange={handleChange}
            placeholder="Enter Headquarters Location"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Contact Role</label>
          <select
            name="contactRole"
            value={formData.contactRole}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Role</option>
            <option value="ceo">CEO</option>
            <option value="founder">Founder</option>
            <option value="cto">CTO</option>
            <option value="manager">Manager</option>
            <option value="director">Director</option>
            <option value="owner">Owner</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Company Size</label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Company Size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-1000">201-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Work Preference</label>
          <select
            name="workPreference"
            value={formData.workPreference}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Work Preference</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">GST Number</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="Enter GST Number"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Business Registration Number</label>
          <input
            type="text"
            name="businessRegNumber"
            value={formData.businessRegNumber}
            onChange={handleChange}
            placeholder="Enter Business Registration Number"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">PAN Number</label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            placeholder="Enter PAN Number"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Short Description</label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="Enter Short Description"
          rows="4"
          className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none"
        />
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="profName"
            value={formData.profName}
            onChange={handleChange}
            placeholder="Enter Name"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter Role"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Professional Category</label>
          <select
            name="profCategory"
            value={formData.profCategory}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Category</option>
            {Object.keys(professionalCategories).filter(key => key !== "").map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Work Preference</label>
          <select
            name="profWorkPreference"
            value={formData.profWorkPreference}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Work Preference</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
            <option value="flexible">Flexible</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Years of Experience</label>
          <select
            name="yearsExperience"
            value={formData.yearsExperience}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Experience</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10-15">10-15 years</option>
            <option value="15+">15+ years</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Skills & Technologies</label>
          <select
            name="skillsTech"
            value={formData.skillsTech}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Primary Skill</option>
            {skillsOptions.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderSocialInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Name</label>
          <input
            type="text"
            name="socialName"
            value={formData.socialName}
            onChange={handleChange}
            placeholder="Enter Name"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Social Category</label>
          <select
            name="socialCategory"
            value={formData.socialCategory}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Category</option>
            <option value="sports">Sports & Fitness</option>
            <option value="arts">Arts & Culture</option>
            <option value="music">Music</option>
            <option value="travel">Travel</option>
            <option value="food">Food & Cooking</option>
            <option value="reading">Reading & Literature</option>
            <option value="gaming">Gaming</option>
            <option value="volunteering">Volunteering</option>
            <option value="networking">Professional Networking</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Hobbies <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            placeholder="Enter your hobbies (comma separated)"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">What is your biggest motivation to join Ekam Global Network?</label>
          <textarea
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            placeholder="Share your motivation..."
            rows="4"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Would you be able to travel for group events?</label>
          <select
            name="travelAvailable"
            value={formData.travelAvailable}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select your answer</option>
            <option value="yes">Yes, always</option>
            <option value="sometimes">Sometimes, depends on schedule</option>
            <option value="local-only">Local events only</option>
            <option value="no">No, unable to travel</option>
          </select>
          
          {/* Additional preferences */}
          <div className="mt-4">
            <label className="block text-gray-300 text-sm mb-2">Preferred event types</label>
            <div className="space-y-2">
              {['Networking Events', 'Workshops', 'Social Gatherings', 'Business Meetups', 'Cultural Events'].map(eventType => (
                <label key={eventType} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-300 text-sm">{eventType}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderBusinessInfo();
      case 2: return renderProfessionalInfo();
      case 3: return renderSocialInfo();
      default: return renderBasicInfo();
    }
  };

  const renderProgressBar = () => {
    const getProgressForStep = (step) => {
      if (step === 0) return 0;
      if (step === 1) return 33;
      if (step === 2) return 66;
      if (step === 3) return 100;
      return 100;
    };

    const progress = getProgressForStep(currentStep);

    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2 px-1">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center transition-colors duration-300 ${
                index <= currentStep ? 'text-orange-400' : 'text-gray-400'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                index <= currentStep ? 'bg-orange-400 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <span className="text-xs font-medium text-center leading-tight">
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full bg-gray-600 rounded-full h-1">
          <motion.div
            className="bg-orange-500 h-1 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <AnimatePresence>
        {success && (
          <motion.div
            className="absolute inset-0 bg-gray-900/95 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <IoMdCheckmarkCircleOutline className="w-32 h-32 text-green-500 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-2">Success!</h2>
              <p className="text-xl text-gray-300 mb-8">You're being redirected...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-center" autoClose={3000} theme="dark" />

      {/* Header */}
      <div className="bg-white  relative z-10">
  <div className="text-center">
    <img
      src="../../assests/Screenshot (101).png"
      alt="EKAM Logo"
      className="w-full h-38 object-cover" 
    />
  </div>
</div>

      <div className="bg-gray-900 py-6">
        <div className="w-full px-6">
          <h2 className="text-2xl font-semibold text-center mb-8 text-white">
            Ekam Global Network Registration
          </h2>

          {renderProgressBar()}

          <div className=" backdrop-blur-sm rounded-2xl px-2 w-full">
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[400px]"
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between items-center pt-6">
  <div className="flex space-x-4 w-full">
    {currentStep > 0 && (
      <button
        type="button"
        onClick={handlePrev}
        className="w-1/3 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300 text-lg"
      >
        Previous
      </button>
    )}
    {currentStep < steps.length - 1 ? (
      <button
        type="button"
        onClick={handleNext}
        className="w-1/3 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-300 text-lg"
      >
        Next
      </button>
    ) : (
      <button
        type="submit"
        disabled={loading}
        className="w-1/3 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </div>
        ) : (
          "Submit Registration"
        )}
      </button>
    )}
  </div>
</div>

            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-2">
                Already have an account?
              </p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-300 underline underline-offset-2"
              >
                Sign In to Existing Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;