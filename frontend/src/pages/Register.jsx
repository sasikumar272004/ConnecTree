import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { 
  FaUser, FaEnvelope, FaLock, FaArrowRight, FaPhone, FaMapMarkerAlt, 
  FaBriefcase, FaGraduationCap, FaHeart, FaCalendarAlt, FaUpload,
  FaBuilding, FaIdCard, FaFlag
} from "react-icons/fa";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    // Basic Info
    name: "", email: "", password: "", phone: "", gender: "", dateOfBirth: "",
    streetAddress: "", city: "", state: "", pincode: "", country: "",
    chapter: "", joinDate: "", expectations: "",
    
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
  const [showPassword, setShowPassword] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { id: 'basic', title: 'Basic Info', icon: <FaUser className="w-5 h-5" /> },
    { id: 'business', title: 'Business', icon: <FaBriefcase className="w-5 h-5" /> },
    { id: 'professional', title: 'Professional', icon: <FaGraduationCap className="w-5 h-5" /> },
    { id: 'social', title: 'Social & Hobbies', icon: <FaHeart className="w-5 h-5" /> }
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const newCompleted = [...completedSteps];
      if (!newCompleted.includes(currentStep)) {
        newCompleted.push(currentStep);
        setCompletedSteps(newCompleted);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, payload);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setSuccess(true);
      toast.success(isLogin ? "Login successful!" : "Registration successful!");
      setTimeout(() => navigate("/Home"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setCurrentStep(0);
    setCompletedSteps([]);
    navigate("/login");
  };

  const renderLoginForm = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-gray-300 text-sm mb-2">Email address <span className="text-red-500">*</span></label>
        <div className="relative">
          <FaEnvelope className="absolute left-4 top-4 text-orange-400 text-lg" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="w-full pl-12 pr-4 py-4 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-300 text-sm mb-2">Password <span className="text-red-500">*</span></label>
        <div className="relative">
          <FaLock className="absolute left-4 top-4 text-orange-400 text-lg" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full pl-12 pr-12 py-4 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
          <button
            type="button"
            className="absolute right-4 top-4 text-gray-400 hover:text-orange-400 text-lg transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-6">
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
      <div className="grid grid-cols-3 gap-6">
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
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Date of birth <span className="text-red-500">*</span></label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            placeholder="Select date of birth (mm/dd/yyyy)"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Upload profile Photo</label>
          <div className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-gray-400 flex items-center justify-between">
            <span>Choose File</span>
            <span className="text-sm">No file chosen</span>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Street Address <span className="text-red-500">*</span></label>
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
          <label className="block text-gray-300 text-sm mb-2">City <span className="text-red-500">*</span></label>
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
          <label className="block text-gray-300 text-sm mb-2">State <span className="text-red-500">*</span></label>
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

      {/* Row 4 */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Pincode <span className="text-red-500">*</span></label>
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
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter Country"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
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

      {/* Row 5 */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Which chapter are you registering for? <span className="text-red-500">*</span></label>
          <select
            name="chapter"
            value={formData.chapter}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            required
          >
            <option value="">Select your answer</option>
            <option value="mumbai">Mumbai Chapter</option>
            <option value="delhi">Delhi Chapter</option>
            <option value="bangalore">Bangalore Chapter</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Please let us know what you expect from Ekam</label>
          <input
            type="text"
            name="expectations"
            value={formData.expectations}
            onChange={handleChange}
            placeholder="Enter your answer"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );

  const renderBusinessInfo = () => (
    <div className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Business Name <span className="text-red-500">*</span></label>
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
          <label className="block text-gray-300 text-sm mb-2">Business Category <span className="text-red-500">*</span></label>
          <select
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Category</option>
            <option value="tech">Technology</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Sub-category</label>
          <input
            type="text"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            placeholder="Enter Sub-category"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-6">
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

      {/* Row 3 */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Contact Role </label>
          <input
            type="text"
            name="contactRole"
            value={formData.contactRole}
            onChange={handleChange}
            placeholder="Enter Contact Role"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
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
          </select>
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-3 gap-6">
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

      {/* Row 5 */}
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
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-6">
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
          <label className="block text-gray-300 text-sm mb-2">Role <span className="text-red-500">*</span></label>
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
          <label className="block text-gray-300 text-sm mb-2">Professional Category <span className="text-red-500">*</span></label>
          <select
            name="profCategory"
            value={formData.profCategory}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Category</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Work Preference <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="profWorkPreference"
            value={formData.profWorkPreference}
            onChange={handleChange}
            placeholder="Enter Work Preference"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Years of Experience</label>
          <input
            type="text"
            name="yearsExperience"
            value={formData.yearsExperience}
            onChange={handleChange}
            placeholder="Enter Years of Experience"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Skills & Technologies</label>
          <select
            name="skillsTech"
            value={formData.skillsTech}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Enter Skills & Technologies</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="react">React</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSocialInfo = () => (
    <div className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-6">
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
          <label className="block text-gray-300 text-sm mb-2">Social Category <span className="text-red-500">*</span></label>
          <select
            name="socialCategory"
            value={formData.socialCategory}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select Category</option>
            <option value="sports">Sports</option>
            <option value="arts">Arts</option>
            <option value="music">Music</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Hobbies <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            placeholder="Enter Hobbies"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">What is your biggest motivation to join Ekam Global Network?</label>
          <input
            type="text"
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            placeholder="Enter your answer"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
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
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="sometimes">Sometimes</option>
          </select>
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
    // Progress with 3 break points: 0%, 50%, 100%
    const getProgressForStep = (step) => {
      if (step === 0) return 0;
      if (step === 1) return 33;
      if (step === 2) return 66;
      if (step === 3) return 97;
      if (step === 4) return 100;

      return 100;
    };

    const progress = getProgressForStep(currentStep);

    return (
      <div className="mb-8">
        {/* Progress Labels with Step Titles and Icons */}
        <div className="flex justify-between mb-2 px-1">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center transition-colors duration-300 ${
                index <= currentStep ? 'text-orange-400' : 'text-gray-400'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1  ${
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

        {/* Progress Bar with 3 break points */}
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
    <div className="h-fit  bg-gray-900 text-white relative overflow-hidden">
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
      <div className="bg-white py-4 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            E<span className="text-orange-500">.</span>K<span className="text-orange-500">.</span>A<span className="text-orange-500">.</span>M
          </h1>
          <p className="text-gray-600 text-sm">One Network Infinite Aspirations</p>
        </div>
      </div>

      <div className="bg-gray-900 py-6">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-8 text-white">
            {isLogin ? "Welcome Back" : "Ekam Global Network registration"}
          </h2>

          
          {/* Progress Bar - Only show for registration */}
          {!isLogin && renderProgressBar()}

          {/* Form Container */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 w-full">
            <form onSubmit={handleSubmit} className="space-y-8">
              {isLogin ? (
                <div className="min-h-[300px] flex items-center">
                  {renderLoginForm()}
                </div>
              ) : (
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
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-center pt-6">
                {isLogin ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <FaArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex space-x-4">
                    {currentStep > 0 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300 text-lg"
                      >
                        Previous
                      </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-300 text-lg"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </form>

            {/* Toggle Auth Mode */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-2">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-300 underline underline-offset-2"
              >
                {isLogin ? "Create New Registration" : "Sign In to Existing Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;