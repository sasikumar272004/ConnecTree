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
    return null; // or a loading skeleton
  }

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
          <div className="relative h-28 lg:h-32 w-full">
            <img
              src={userProfile.coverImage || "data:image/jpeg;base64,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"}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {/* Avatar */}
            <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
              <div className="relative">
                <img
                  src={
                    userProfile.profilePhoto?.url ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhb5ZfVfC8ydANhC_LsUDp2HHtNyDixuTAaQ&s"
                  }
                  alt="Profile"
                  className="w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover ring-4 ring-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-6 text-center">
            <h3 className="font-bold text-xl lg:text-2xl text-white">
              {userProfile.name}
            </h3>
            <p className="text-gray-300 text-sm lg:text-base">
              {userProfile.email}
            </p>
            <p className="text-gray-400 text-xs lg:text-sm">
              {userProfile.businessCategory}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mx-6"></div>

          {/* Stats */}
          <div className="grid grid-cols-2 py-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {pagination?.totalPosts || feedPosts.length}
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
                    {savedPostsData.length}
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
