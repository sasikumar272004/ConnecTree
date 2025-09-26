import React, { useEffect, useState } from "react";

const LeftSidebar = ({ 
  pagination, 
  feedPosts, 
  activeTab, 
  setActiveTab, 
  savedPostsData, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Fetch user profile from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
  }, []);

  if (!userProfile) {
    return null;
  }

  // Get the correct profile photo URL - fix the path issue
  const getProfilePhotoUrl = () => {
    // Check if profilePhotoUrl exists and construct proper URL
    if (userProfile.profilePhotoUrl) {
      // If it's already a full URL, use it directly
      if (userProfile.profilePhotoUrl.startsWith('http')) {
        return userProfile.profilePhotoUrl;
      }
      // If it's a path, prepend your server URL
      return `http://localhost:5000${userProfile.profilePhotoUrl}`; // Adjust port as needed
    }
    
    // Fallback to default image
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhb5ZfVfC8ydANhC_LsUDp2HHtNyDixuTAaQ&s";
  };

  const profilePhotoUrl = getProfilePhotoUrl();

  return (
    <div
      className={`
      ${isMobileMenuOpen ? "block" : "hidden"} 
      lg:block lg:w-80 lg:flex-shrink-0
    `}
    >
      <div className="space-y-6 lg:sticky lg:top-6">
        {/* Profile Card */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">
          {/* Cover Image */}
          <div className="relative h-28 lg:h-32 w-full bg-gradient-to-r from-blue-600 to-purple-600">
            {/* Avatar */}
            <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
              <div className="relative">
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover ring-4 ring-gray-900"
                  onError={(e) => {
                    e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhb5ZfVfC8ydANhC_LsUDp2HHtNyDixuTAaQ&s";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-6 text-center">
            <h3 className="font-bold text-xl lg:text-2xl text-white">
              {userProfile.name || "User Name"}
            </h3>
            <p className="text-gray-300 text-sm lg:text-base">
              {userProfile.email || "user@example.com"}
            </p>
            <p className="text-gray-400 text-xs lg:text-sm">
              {userProfile.businessCategory || "Business Category"}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mx-6"></div>

          {/* Stats */}
          <div className="grid grid-cols-2 py-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {pagination?.totalPosts || feedPosts?.length || 0}
              </div>
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                Posts
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {userProfile.connections || 0}
              </div>
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                Connections
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-900 overflow-hidden border border-gray-800 shadow-xl">
            {["My Feeds", "Saved Posts"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 lg:px-6 py-3 lg:py-4 text-left font-medium transition-all duration-200 flex items-center justify-between ${
                  activeTab === tab
                    ? "text-white shadow-lg bg-gray-800"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-sm lg:text-base">{tab}</span>
                {tab === "Saved Posts" && (
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                    {savedPostsData?.length || 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;