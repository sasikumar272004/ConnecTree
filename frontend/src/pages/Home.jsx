// components/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBell, FaUser, FaChevronDown, FaHandshake, FaBuilding, 
  FaGraduationCap, FaHeart, FaUsers, FaCog, FaExchangeAlt,
  FaCalendarAlt, FaEye, FaComments, FaRss, FaUserFriends, FaSignOutAlt,
  FaUserPlus, FaStar, FaGlobe, FaShareAlt
} from 'react-icons/fa';

// Import the components - adjust path based on your file structure
import { DataTable, DataForm } from '../components/DataTable';
import { businessSections, BusinessSectionManager } from '../config/businessSections';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedSubmenu, setSelectedSubmenu] = useState(null);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentView, setCurrentView] = useState('table');
  const [selectedItem, setSelectedItem] = useState(null);
  // Add state to force re-renders when data changes
  const [dataUpdateTrigger, setDataUpdateTrigger] = useState(0);
  // Add state for business closed form
  const [showBusinessClosedForm, setShowBusinessClosedForm] = useState(false);
  const [businessClosedSourceItem, setBusinessClosedSourceItem] = useState(null);
  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Add global handler for business closed
  useEffect(() => {
    window.handleAddBusinessClosed = (sourceItem) => {
      setBusinessClosedSourceItem(sourceItem);
      setShowBusinessClosedForm(true);
    };
    
    return () => {
      delete window.handleAddBusinessClosed;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.registrationData) {
      delete window.registrationData;
    }
    navigate('/login');
  };

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaBuilding },
    { id: 'business', label: 'Business', icon: FaHandshake },
    { id: 'professional', label: 'Professional', icon: FaGraduationCap },
    { id: 'social', label: 'Social', icon: FaHeart },
    { id: 'groups', label: 'Groups', icon: FaUsers },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  const businessSubmenu = [
    { id: 'p2p', label: 'P2P', icon: FaExchangeAlt },
    { id: 'business-opportunity-received', label: 'Business Opportunity Received', icon: FaHandshake },
    { id: 'business-opportunity-given', label: 'Business Opportunity Given', icon: FaHandshake },
    { id: 'business-closed', label: 'Business Closed', icon: FaBuilding },
    { id: 'meetings', label: 'Meetings', icon: FaCalendarAlt },
    { id: 'connections', label: 'Connections', icon: FaUserFriends },
    { id: 'testimonials', label: 'Testimonials', icon: FaStar },
    { id: 'upcoming-events', label: 'Upcoming Events', icon: FaCalendarAlt },
    { id: 'visitors', label: 'Visitors', icon: FaUserPlus },
    { id: 'my-feeds', label: 'My Feeds', icon: FaRss },
    { id: 'one-to-many', label: 'One to Many', icon: FaShareAlt }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'business') {
      setActiveDropdown(activeDropdown === 'business' ? null : 'business');
    } else {
      setActiveDropdown(null);
      if (tabId !== 'business') {
        setSelectedSubmenu(null);
        setCurrentView('table');
        setSelectedItem(null);
        setShowBusinessClosedForm(false);
        setBusinessClosedSourceItem(null);
      }
    }
  };

  const handleSubmenuClick = (submenuId) => {
    setSelectedSubmenu(submenuId);
    setActiveDropdown(null);
    setCurrentView('table');
    setSelectedItem(null);
    setShowBusinessClosedForm(false);
    setBusinessClosedSourceItem(null);
  };

  // Business section handlers
  const handleAddNew = () => {
    setSelectedItem(null);
    setCurrentView('form');
    setShowBusinessClosedForm(false);
    setBusinessClosedSourceItem(null);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setCurrentView('form');
    setShowBusinessClosedForm(false);
    setBusinessClosedSourceItem(null);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    console.log('View item:', item);
  };

  const handleDelete = (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const currentData = BusinessSectionManager.getSectionData(selectedSubmenu);
      const updatedData = currentData.filter(dataItem => dataItem.id !== item.id);
      BusinessSectionManager.updateSectionData(selectedSubmenu, updatedData);
      // Force re-render by updating trigger
      setDataUpdateTrigger(prev => prev + 1);
    }
  };

  const handleFormSubmit = (formData) => {
    if (selectedItem) {
      // Update existing item
      const currentData = BusinessSectionManager.getSectionData(selectedSubmenu);
      const updatedData = currentData.map(item => 
        item.id === selectedItem.id ? { ...item, ...formData } : item
      );
      BusinessSectionManager.updateSectionData(selectedSubmenu, updatedData);
    } else {
      // Add new item
      BusinessSectionManager.addItemToSection(selectedSubmenu, formData);
    }
    
    setCurrentView('table');
    setSelectedItem(null);
    // Force re-render by updating trigger
    setDataUpdateTrigger(prev => prev + 1);
    console.log('Form submitted successfully');
  };

  const handleFormCancel = () => {
    setCurrentView('table');
    setSelectedItem(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container') && !event.target.closest('.user-menu-container')) {
        setActiveDropdown(null);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show loading if user data is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get current section configuration
  const getCurrentSectionConfig = () => {
    if (!selectedSubmenu) return null;
    return BusinessSectionManager.getSectionConfig(selectedSubmenu);
  };

  const renderBusinessContent = () => {
    // Handle Business Closed form
    if (showBusinessClosedForm) {
      const businessClosedConfig = BusinessSectionManager.getSectionConfig('business-closed');
      return (
        <DataForm
          title="Add Business Closed"
          fields={businessClosedConfig.formConfig.fields}
          initialData={{
            referralName: businessClosedSourceItem?.referralName || '',
            email: businessClosedSourceItem?.email || '',
            phone: businessClosedSourceItem?.phone || '',
            ...businessClosedSourceItem
          }}
          onSubmit={(formData) => {
            BusinessSectionManager.addItemToSection('business-closed', formData);
            setShowBusinessClosedForm(false);
            setBusinessClosedSourceItem(null);
            setDataUpdateTrigger(prev => prev + 1);
          }}
          onCancel={() => {
            setShowBusinessClosedForm(false);
            setBusinessClosedSourceItem(null);
          }}
          submitText="Add Business Closed"
          cancelText="Cancel"
        />
      );
    }

    const sectionConfig = getCurrentSectionConfig();
    
    // If no section config exists, show under development message
    if (!sectionConfig) {
      return (
        <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-slate-700 mb-4 flex justify-center">
              <FaHandshake />
            </div>
            <h2 className="text-2xl font-semibold text-slate-500 mb-2">
              {selectedSubmenu?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Section'}
            </h2>
            <p className="text-slate-600">
              This section is under development.
            </p>
          </div>
        </div>
      );
    }

    const sectionData = BusinessSectionManager.getSectionData(selectedSubmenu);

    if (currentView === 'form') {
      return (
        <DataForm
          title={selectedItem ? `Edit ${sectionConfig.title}` : sectionConfig.formConfig.title}
          fields={sectionConfig.formConfig.fields}
          editFields={sectionConfig.formConfig.editFields}
          initialData={selectedItem || {}}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          submitText={selectedItem ? 'Update' : sectionConfig.formConfig.submitText}
          cancelText={sectionConfig.formConfig.cancelText}
          isEdit={!!selectedItem}
        />
      );
    }

    return (
      <DataTable
        title={sectionConfig.title}
        data={sectionData}
        columns={sectionConfig.tableConfig.columns}
        filters={sectionConfig.tableConfig.filters}
        onAdd={handleAddNew}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        addButtonText={sectionConfig.tableConfig.addButtonText}
        searchPlaceholder={sectionConfig.tableConfig.searchPlaceholder}
        showActions={sectionConfig.tableConfig.showActions !== false}
        showExportPrint={sectionConfig.tableConfig.showExportPrint !== false}
        showAddButton={sectionConfig.tableConfig.showAddButton !== false}
        key={`${selectedSubmenu}-${dataUpdateTrigger}`} // Force re-render when data changes
      />
    );
  };

  const getWelcomeMessage = () => {
    if (activeTab === 'business' && selectedSubmenu) {
      const sectionConfig = getCurrentSectionConfig();
      return sectionConfig ? `Manage your ${sectionConfig.title.toLowerCase()}.` : "Welcome to your business dashboard.";
    }
    
    const tabMessages = {
      'dashboard': "Your central hub for all networking activities and insights.",
      'business': "Manage your business opportunities, meetings, and connections.",
      'professional': "Develop your professional skills and career opportunities.",
      'social': "Connect and engage with your network community.",
      'groups': "Join and participate in specialized networking groups.",
      'settings': "Configure your profile and application preferences."
    };
    
    return tabMessages[activeTab] || "Welcome to the EKAM Global Network.";
  };

  const renderMainContent = () => {
    // If a business submenu is selected or business closed form is shown, show the business content
    if (activeTab === 'business' && (selectedSubmenu || showBusinessClosedForm)) {
      return renderBusinessContent();
    }

    // Default welcome screen
    return (
      <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-slate-700 mb-4 flex justify-center">
            <FaHandshake />
          </div>
          <h2 className="text-2xl font-semibold text-slate-500 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="text-slate-600 max-w-md mb-4">
            {user?.chapter && `${user.chapter} Chapter Member • `}
            {user?.businessCategory && `${user.businessCategory.charAt(0).toUpperCase() + user.businessCategory.slice(1)} • `}
            {getWelcomeMessage()}
          </p>
          <div className="mt-8">
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-white text-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-2xl font-bold">
            E<span className="text-orange-500">K</span>A<span className="text-orange-500">M</span>
          </div>
          <div className="ml-2 text-xs text-gray-600">
            One Network Infinite Aspirations
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <FaBell className="text-gray-600 text-xl cursor-pointer hover:text-orange-500 transition-colors" />
          
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <span className="font-medium text-gray-900">
                {user?.name || 'User'}
              </span>
              <FaChevronDown className={`text-gray-600 text-sm transition-transform ${
                showUserMenu ? 'rotate-180' : ''
              }`} />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
                      {user?.chapter && (
                        <p className="text-xs text-orange-600">{user.chapter} Chapter</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <FaUser className="text-sm" />
                    <span>View Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <FaCog className="text-sm" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-slate-900 relative dropdown-container">
        <div className="flex items-center">
          {navigationTabs.map((tab) => (
            <div key={tab.id} className="flex-1">
              <button
                onClick={() => handleTabClick(tab.id)}
                className={`w-full px-6 py-4 flex items-center justify-center space-x-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-orange-400 border-b-2 border-orange-500'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon className="text-sm" />
                <span>{tab.label}</span>
                {tab.id === 'business' && (
                  <FaChevronDown className={`text-xs transition-transform ${
                    activeDropdown === 'business' ? 'rotate-180' : ''
                  }`} />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Business Dropdown Menu */}
        {activeDropdown === 'business' && (
          <div className="absolute top-full w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 mt-1" 
               style={{ left: `${(100/6) * 1}%` }}>
            {businessSubmenu.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSubmenuClick(item.id)}
                className={`w-full px-4 py-3 flex items-center space-x-3 text-left transition-all duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  selectedSubmenu === item.id
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <item.icon className="text-sm flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {renderMainContent()}

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div>Active Tab: {activeTab}</div>
          <div>Selected: {selectedSubmenu ? selectedSubmenu.replace('-', ' ') : 'None'}</div>
          <div>View: {showBusinessClosedForm ? 'business-closed-form' : currentView}</div>
          <div>EKAM Global Network v2.0</div>
        </div>
      </div>
    </div>
  );
};

export default Home;