import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(""); // Added missing state
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  
  const navigate = useNavigate();
  const particlesInit = async (engine) => await loadFull(engine);
  const otpRefs = useRef([]); // Added missing ref

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('loginFormData');
    const savedForgotOpen = localStorage.getItem('loginForgotOpen');
    const savedForgotStep = localStorage.getItem('loginForgotStep');
    const savedForgotEmail = localStorage.getItem('loginForgotEmail');
    const savedOtpDigits = localStorage.getItem('loginOtpDigits');

    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
    if (savedForgotOpen) {
      setForgotOpen(JSON.parse(savedForgotOpen));
    }
    if (savedForgotStep) {
      setForgotStep(parseInt(savedForgotStep));
    }
    if (savedForgotEmail) {
      setForgotEmail(savedForgotEmail);
    }
    if (savedOtpDigits) {
      setOtpDigits(JSON.parse(savedOtpDigits));
    }
  }, []);

  const particlesOptions = {
    fullScreen: { enable: true, zIndex: -1 },
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: ["#ff6b35", "#f7931e", "#ffb347"] },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: 2, random: true },
      move: { enable: true, speed: 1, random: true },
    },
    interactivity: { events: { onhover: { enable: true, mode: "repulse" } } },
    retina_detect: true,
    background: { color: "#1a202c" },
  };

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    localStorage.setItem('loginFormData', JSON.stringify(newFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email: formData.email, password: formData.password }
      );
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // Clear form data on successful login
      localStorage.removeItem('loginFormData');
      localStorage.removeItem('loginForgotOpen');
      localStorage.removeItem('loginForgotStep');
      localStorage.removeItem('loginForgotEmail');
      localStorage.removeItem('loginOtp');
      setSuccess(true);
      toast.success("Login successful!");
      setTimeout(() => navigate("/Home"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForgotFlow = () => {
    setForgotOpen(false);
    setForgotStep(1);
    setForgotEmail("");
    setOtp("");
    setOtpDigits(["", "", "", "", "", ""]);
    // Clear forgot password data from localStorage
    localStorage.removeItem('loginForgotOpen');
    localStorage.removeItem('loginForgotStep');
    localStorage.removeItem('loginForgotEmail');
    localStorage.removeItem('loginOtp');
    localStorage.removeItem('loginOtpDigits');
  };

  // Save forgot password states to localStorage
  const handleForgotOpen = (value) => {
    setForgotOpen(value);
    localStorage.setItem('loginForgotOpen', JSON.stringify(value));
  };

  const handleForgotStep = (value) => {
    setForgotStep(value);
    localStorage.setItem('loginForgotStep', value.toString());
  };

  const handleForgotEmail = (value) => {
    setForgotEmail(value);
    localStorage.setItem('loginForgotEmail', value);
  };

  const handleOtp = (value) => {
    setOtp(value);
    localStorage.setItem('loginOtp', value);
  };

  // Added missing OTP handler functions
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    localStorage.setItem('loginOtpDigits', JSON.stringify(newOtpDigits));

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Update combined OTP
    const combinedOtp = newOtpDigits.join('');
    setOtp(combinedOtp);
    localStorage.setItem('loginOtp', combinedOtp);
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtpDigits = [...otpDigits];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtpDigits[i] = pastedData[i];
    }
    setOtpDigits(newOtpDigits);
    localStorage.setItem('loginOtpDigits', JSON.stringify(newOtpDigits));

    const combinedOtp = newOtpDigits.join('');
    setOtp(combinedOtp);
    localStorage.setItem('loginOtp', combinedOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtpDigits.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
    otpRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      // Add your OTP verification logic here
      console.log("Verifying OTP:", otp, "for email:", forgotEmail);
      toast.success("OTP verified successfully!");
      resetForgotFlow();
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
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
            E<span className="text-orange-500">K</span>A
            <span className="text-orange-500">M</span>
          </h1>
          <p className="text-gray-600">One Network Infinite Aspirations</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
          >
            <div className="p-10">
              <h2 className="text-3xl font-bold text-center mb-8 text-white">
                {forgotOpen ? "Forgot Password" : "Welcome Back"}
              </h2>

              {!forgotOpen ? (
                // LOGIN FORM
                <form onSubmit={handleSubmit} className="space-y-8">
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
                      {/* Forgot Password Link */}
                      <div className="text-right mt-2">
                        <button
                          type="button"
                          onClick={() => handleForgotOpen(true)}
                          className="text-sm text-orange-400 hover:text-orange-300"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>
                  </div>

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
                </form>
              ) : (
                // FORGOT PASSWORD FLOW
                <div className="space-y-6">
                  {forgotStep === 1 && (
                    <>
                      <p className="text-gray-300 text-center">
                        Enter your email to reset password
                      </p>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => handleForgotEmail(e.target.value)}
                        placeholder="Your Email Address"
                        className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      />
                      <div className="space-y-3">
                        <button
                          onClick={() => handleForgotStep(2)}
                          className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-semibold transition"
                        >
                          Send OTP
                        </button>
                        <button
                          type="button"
                          onClick={() => handleForgotOpen(false)}
                          className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold transition-all duration-300"
                        >
                          Back to Login
                        </button>
                      </div>
                    </>
                  )}

                  {forgotStep === 2 && (
                    <>
                      <p className="text-gray-300 text-center mb-6">
                        Enter the 6-digit OTP sent to <br />
                        <span className="text-orange-400">{forgotEmail}</span>
                      </p>
                      
                      {/* OTP Input Boxes */}
                      <div className="flex justify-center space-x-3 mb-8">
                        {otpDigits.map((digit, index) => (
                          <motion.input
                            key={index}
                            ref={(el) => (otpRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={index === 0 ? handleOtpPaste : undefined}
                            className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white text-center text-xl font-bold focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-gray-600"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                          />
                        ))}
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={handleVerifyOtp}
                          className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          Verify OTP
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleForgotOpen(false)}
                          className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold transition-all duration-300"
                        >
                          Back to Login
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {!forgotOpen && (
                <div className="mt-8 text-center">
                  <p className="text-gray-400 mb-4">Don't have an account?</p>
                  <a
                    href="/register"
                    className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-300 underline decoration-2 underline-offset-4 hover:decoration-orange-300"
                  >
                    Create New Registration
                  </a>
                </div>
              )}
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

export default Login;