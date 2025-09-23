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
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

const Signup = () => {
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

  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const navigate = useNavigate();

  const steps = [
    { id: 'basic', title: 'Basic Info', icon: <FaUser /> },
    { id: 'business', title: 'Business', icon: <FaBriefcase /> },
    { id: 'professional', title: 'Professional', icon: <FaGraduationCap /> },
    { id: 'social', title: 'Social & Hobbies', icon: <FaHeart /> }
  ];

  const particlesInit = async (engine) => await loadFull(engine);

  const particlesOptions = {
    fullScreen: { enable: true, zIndex: -1 },
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: ["#ff6b35", "#f7931e", "#ffb347"] },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: 2, random: true },
      move: { enable: true, speed: 1, random: true }
    },
    interactivity: { events: { onhover: { enable: true, mode: "repulse" } } },
    retina_detect: true,
    background: { color: "#1a202c" }
  };

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
      // Registration validation can be added here
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
    setFormData({
      name: "", email: "", password: "", phone: "", gender: "", dateOfBirth: "",
      streetAddress: "", city: "", state: "", pincode: "", country: "",
      chapter: "", joinDate: "", expectations: "",
      businessName: "", sponsorName: "", contactRole: "", gstNumber: "",
      businessCategory: "", establishedYear: "", companySize: "", businessRegNumber: "",
      subCategory: "", headquarters: "", workPreference: "", panNumber: "", shortDescription: "",
      profName: "", role: "", profCategory: "", profWorkPreference: "", yearsExperience: "", skillsTech: "",
      socialName: "", socialCategory: "", hobbies: "", motivation: "", travelAvailable: ""
    });
  };

  const renderLoginForm = () => (
    <div className="space-y-6">
      <div className="relative">
        <FaEnvelope className="absolute left-4 top-4 text-orange-400 text-lg" />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          required
        />
      </div>
      <div className="relative">
        <FaLock className="absolute left-4 top-4 text-orange-400 text-lg" />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
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
  );

  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="relative">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          required
        />
      </div>
      <div className="relative">
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter Phone number"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          required
        />
      </div>
      <div className="relative">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          required
        />
      </div>
      <div className="relative">
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          required
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="relative">
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="file"
          name="profilePhoto"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
          placeholder="Enter Street Address"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter City"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="Enter State"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Enter pincode"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Enter Country"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          required
        />
      </div>
      <div className="relative">
        <select
          name="chapter"
          value={formData.chapter}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          required
        >
          <option value="">Select your answer</option>
          <option value="mumbai">Mumbai Chapter</option>
          <option value="delhi">Delhi Chapter</option>
          <option value="bangalore">Bangalore Chapter</option>
        </select>
      </div>
      <div className="relative">
        <input
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          required
        />
      </div>
      <div className="md:col-span-3">
        <textarea
          name="expectations"
          value={formData.expectations}
          onChange={handleChange}
          placeholder="Enter your answer"
          rows="4"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
        />
      </div>
    </div>
  );

  const renderBusinessInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="relative">
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Enter business Name"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <select
          name="businessCategory"
          value={formData.businessCategory}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">Select Category</option>
          <option value="tech">Technology</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
        </select>
      </div>
      <div className="relative">
        <input
          type="text"
          name="subCategory"
          value={formData.subCategory}
          onChange={handleChange}
          placeholder="Enter Sub-category"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="sponsorName"
          value={formData.sponsorName}
          onChange={handleChange}
          placeholder="Enter sponsor name"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="establishedYear"
          value={formData.establishedYear}
          onChange={handleChange}
          placeholder="Enter Established Year"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="headquarters"
          value={formData.headquarters}
          onChange={handleChange}
          placeholder="Enter Headquarters Location"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="contactRole"
          value={formData.contactRole}
          onChange={handleChange}
          placeholder="Enter Contact Role"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <select
          name="companySize"
          value={formData.companySize}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">Select Company Size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="200+">200+ employees</option>
        </select>
      </div>
      <div className="relative">
        <select
          name="workPreference"
          value={formData.workPreference}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">Select Work Preference</option>
          <option value="remote">Remote</option>
          <option value="onsite">On-site</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>
      <div className="relative">
        <input
          type="text"
          name="gstNumber"
          value={formData.gstNumber}
          onChange={handleChange}
          placeholder="Enter GST Number"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="businessRegNumber"
          value={formData.businessRegNumber}
          onChange={handleChange}
          placeholder="Enter Business Registration Number"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleChange}
          placeholder="Enter PAN Number"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="md:col-span-3">
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="Enter Short Description"
          rows="4"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
        />
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="relative">
        <input
          type="text"
          name="profName"
          value={formData.profName}
          onChange={handleChange}
          placeholder="Enter Name"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          required
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Enter Role"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <select
          name="profCategory"
          value={formData.profCategory}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">Select Category</option>
          <option value="engineering">Engineering</option>
          <option value="marketing">Marketing</option>
          <option value="sales">Sales</option>
          <option value="design">Design</option>
        </select>
      </div>
      <div className="relative">
        <input
          type="text"
          name="profWorkPreference"
          value={formData.profWorkPreference}
          onChange={handleChange}
          placeholder="Enter Work Preference"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="yearsExperience"
          value={formData.yearsExperience}
          onChange={handleChange}
          placeholder="Enter Years of Experience"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <select
          name="skillsTech"
          value={formData.skillsTech}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">Enter Skills & Technologies</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="react">React</option>
          <option value="nodejs">Node.js</option>
        </select>
      </div>
    </div>
  );

  const renderSocialInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="relative">
        <input
          type="text"
          name="socialName"
          value={formData.socialName}
          onChange={handleChange}
          placeholder="Enter Name"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        />
      </div>
      <div className="relative">
        <select
          name="socialCategory"
          value={formData.socialCategory}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">Select Category</option>
          <option value="sports">Sports</option>
          <option value="arts">Arts</option>
          <option value="music">Music</option>
          <option value="travel">Travel</option>
        </select>
      </div>
      <div className="relative md:col-span-2">
        <input
          type="text"
          name="hobbies"
          value={formData.hobbies}
          onChange={handleChange}
          placeholder="Enter Hobbies"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          required
        />
      </div>
      <div className="relative md:col-span-2">
        <textarea
          name="motivation"
          value={formData.motivation}
          onChange={handleChange}
          placeholder="Enter your answer"
          rows="3"
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
        />
      </div>
      <div className="relative md:col-span-2">
        <select
          name="travelAvailable"
          value={formData.travelAvailable}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">Select your answer</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="sometimes">Sometimes</option>
        </select>
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
    const progress = ((currentStep + 1) / steps.length) * 100;
    return (
      <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
        <motion.div 
          className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />

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
      <div className="bg-white py-6 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            E<span className="text-orange-500">K</span>A<span className="text-orange-500">M</span>
          </h1>
          <p className="text-gray-600">One Network Infinite Aspirations</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
          >
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-white">
                {isLogin ? "Welcome Back" : "Ekam Global Network registration"}
              </h2>

              {!isLogin && (
                <>
                  {/* Progress Bar */}
                  {renderProgressBar()}

                  {/* Step Navigation */}
                  <div className="flex justify-center mb-8">
                    <div className="flex space-x-8">
                      {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                            ${index === currentStep 
                              ? 'bg-orange-500 border-orange-500 text-white' 
                              : completedSteps.includes(index)
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-gray-700 border-gray-600 text-gray-400'
                            }
                          `}>
                            {completedSteps.includes(index) ? (
                              <IoMdCheckmarkCircleOutline className="w-6 h-6" />
                            ) : (
                              <span className="text-lg">{step.icon}</span>
                            )}
                          </div>
                          <span className={`
                            mt-2 text-sm font-medium transition-colors duration-300
                            ${index === currentStep 
                              ? 'text-orange-400' 
                              : completedSteps.includes(index)
                              ? 'text-green-400'
                              : 'text-gray-400'
                            }
                          `}>
                            {step.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {isLogin ? (
                  <>
                    {renderLoginForm()}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <FaArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {renderStepContent()}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between items-center pt-8">
                      {currentStep > 0 && (
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-300 flex items-center space-x-2"
                        >
                          <span>Back</span>
                        </button>
                      )}
                      
                      <div className="flex-1"></div>
                      
                      {currentStep < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center space-x-2"
                        >
                          <span>Next</span>
                          <FaArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <span>Submit</span>
                              <FaArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </form>

              {/* Toggle Auth Mode */}
              <div className="mt-8 text-center">
                <p className="text-gray-400 mb-4">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-300 underline decoration-2 underline-offset-4 hover:decoration-orange-300"
                >
                  {isLogin ? "Create New Registration" : "Sign In to Existing Account"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent"></div>
</div>
);
};

export default Signup;


