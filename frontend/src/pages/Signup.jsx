import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const navigate = useNavigate();
  const controls = useAnimation();

  const particlesInit = async (engine) => await loadFull(engine);

  const particlesOptions = {
    fullScreen: { enable: true, zIndex: -1 },
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: ["#a5b4fc", "#c7d2fe", "#e9d5ff", "#fbcfe8", "#fecaca"] },
      shape: { type: ["circle", "triangle", "star"] },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 1.5, random: true }
    },
    interactivity: { events: { onhover: { enable: true, mode: "repulse" } } },
    retina_detect: true,
    background: { color: "#f8fafc" }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
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

  const toggleAuthMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />

      <AnimatePresence>
        {success && (
          <motion.div
            className="absolute inset-0 bg-white/90 flex items-center justify-center z-50"
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
              <h2 className="text-4xl font-bold text-gray-700 mb-2">Success!</h2>
              <p className="text-xl text-gray-500 mb-8">You're being redirected...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-center" autoClose={3000} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/20 relative p-8">
          <h2 className="text-3xl font-bold mb-4 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-blue-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
            )}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-blue-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-300"
                required
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-blue-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-300"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-blue-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3 text-white rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500"
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
          <p className="text-center mt-4 text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={toggleAuthMode} className="text-blue-500 font-medium">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
