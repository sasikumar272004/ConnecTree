import React from 'react';
import Login from './Login';
import bgImage from '../../assests/d82059e1498aec9eeb128da0b65e14d55c9f5a7f.png';

const Logind = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 filter brightness-20"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      {/* Optional Overlay for extra darkness */}
      <div className="absolute inset-0 bg-gray-900/30 z-0"></div>

      {/* Blurred Floating White Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-72 h-72 bg-white/10 rounded-full filter blur-3xl top-10 left-10 animate-pulseSlow"></div>
        <div className="absolute w-96 h-96 bg-white/20 rounded-full filter blur-2xl top-1/3 right-20 animate-pulseSlow"></div>
        <div className="absolute w-60 h-60 bg-white/15 rounded-full filter blur-3xl bottom-20 left-1/4 animate-pulseSlow"></div>
        <div className="absolute w-80 h-80 bg-white/10 rounded-full filter blur-2xl bottom-[-20] right-0 animate-pulseSlow"></div>
      </div>

      {/* Centered Card */}
      <div className="h-[70vh] max-w-2xl bg-gray-100/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <Login />
      </div>
    </div>
  );
};

export default Logind;
