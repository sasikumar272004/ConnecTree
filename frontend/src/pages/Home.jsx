// components/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Bell, User, ChevronDown, Handshake, Building, 
  GraduationCap, Heart, Users, Settings, ArrowLeftRight,
  CalendarDays, Eye, MessageSquare, Rss, Users2, LogOut,
  UserPlus, Star, Globe, Share, Cog
} from 'lucide-react';

// Import the components - adjust path based on your file structure
import { DataTable, DataForm } from '../components/DataTable';
import { businessSections, BusinessSectionManager } from '../config/businessSections';
import { ConnectionsComponent, TestimonialsComponent } from '../components/ConnectionsTestimonialsComponents';
// Add this import at the top with your other imports
import MyFeedComponent from '../components/MyFeed'; // Adjust path as needed

const Home = () => {
  // Get URL parameters
  const { tab = 'dashboard', section, view = 'table' } = useParams();
  const navigate = useNavigate();
  
  // UI state
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dataUpdateTrigger, setDataUpdateTrigger] = useState(0);
  const [showBusinessClosedForm, setShowBusinessClosedForm] = useState(false);
  const [businessClosedSourceItem, setBusinessClosedSourceItem] = useState(null);

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
    { id: 'dashboard', label: 'Dashboard', icon: Building },
    { id: 'business', label: 'Business', icon: Handshake },
    { id: 'professional', label: 'Professional', icon: GraduationCap },
    { id: 'social', label: 'Social', icon: Heart },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const businessSubmenu = [
    { id: 'p2p', label: 'P2P', icon: ArrowLeftRight },
    { id: 'business-opportunity-received', label: 'Business Opportunity Received', icon: Handshake },
    { id: 'business-opportunity-given', label: 'Business Opportunity Given', icon: Handshake },
    { id: 'business-closed', label: 'Business Closed', icon: Building },
    { id: 'meetings', label: 'Meetings', icon: CalendarDays },
    { id: 'connections', label: 'Connections', icon: Users2 },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'upcoming-events', label: 'Upcoming Events', icon: CalendarDays },
    { id: 'visitors', label: 'Visitors', icon: UserPlus },
    { id: 'my-feeds', label: 'My Feeds', icon: Rss },
    { id: 'one-to-many', label: 'One to Many', icon: Share }
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'business') {
      setActiveDropdown(activeDropdown === 'business' ? null : 'business');
    } else {
      setActiveDropdown(null);
      navigate(`/home/${tabId}`);
      setSelectedItem(null);
      setShowBusinessClosedForm(false);
      setBusinessClosedSourceItem(null);
    }
  };

  const handleSubmenuClick = (submenuId) => {
    navigate(`/home/business/${submenuId}`);
    setActiveDropdown(null);
    setSelectedItem(null);
    setShowBusinessClosedForm(false);
    setBusinessClosedSourceItem(null);
  };

  // Business section handlers
  const handleAddNew = () => {
    navigate(`/home/business/${section}/form`);
    setSelectedItem(null);
    setShowBusinessClosedForm(false);
    setBusinessClosedSourceItem(null);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    navigate(`/home/business/${section}/form`);
    setShowBusinessClosedForm(false);
    setBusinessClosedSourceItem(null);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    console.log('View item:', item);
  };

  const handleDelete = (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const currentData = BusinessSectionManager.getSectionData(section);
      const updatedData = currentData.filter(dataItem => dataItem.id !== item.id);
      BusinessSectionManager.updateSectionData(section, updatedData);
      // Force re-render by updating trigger
      setDataUpdateTrigger(prev => prev + 1);
    }
  };

  const handleFormSubmit = (formData) => {
    if (selectedItem) {
      // Update existing item
      const currentData = BusinessSectionManager.getSectionData(section);
      const updatedData = currentData.map(item => 
        item.id === selectedItem.id ? { ...item, ...formData } : item
      );
      BusinessSectionManager.updateSectionData(section, updatedData);
    } else {
      // Add new item
      BusinessSectionManager.addItemToSection(section, formData);
    }
    
    navigate(`/home/business/${section}`);
    setSelectedItem(null);
    // Force re-render by updating trigger
    setDataUpdateTrigger(prev => prev + 1);
    console.log('Form submitted successfully');
  };

  const handleFormCancel = () => {
    navigate(`/home/business/${section}`);
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
    if (!section) return null;
    return BusinessSectionManager.getSectionConfig(section);
  };

  const renderBusinessContent = () => {
    // Handle specific business sections with custom components
    switch (section) {
      case 'connections':
        return <ConnectionsComponent />;
      
      case 'testimonials':
        return <TestimonialsComponent />;

       case 'my-feeds':
      return <MyFeedComponent />;
      
      default:
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
        
        // If no section config exists OR section has no tableConfig, show under development message
        if (!sectionConfig || !sectionConfig.tableConfig) {
          return (
            <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl text-slate-700 mb-4 flex justify-center">
                  <Handshake />
                </div>
                <h2 className="text-2xl font-semibold text-slate-500 mb-2">
                  {sectionConfig?.title || section?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Section'}
                </h2>
                <p className="text-slate-600">
                  This section is under development.
                </p>
              </div>
            </div>
          );
        }

        const sectionData = BusinessSectionManager.getSectionData(section);

        if (view === 'form') {
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
            clickableRows={sectionConfig.tableConfig.clickableRows || false}
            key={`${section}-${dataUpdateTrigger}`}
          />
        );
    }
  };

  const getWelcomeMessage = () => {
    if (tab === 'business' && section) {
      const sectionConfig = getCurrentSectionConfig();
      
      // Custom messages for specific sections
      const sectionMessages = {
        'connections': "Build and manage your professional network connections.",
        'testimonials': "Showcase and manage testimonials from your network.",
        'p2p': "Manage peer-to-peer business opportunities.",
        'meetings': "Schedule and track your business meetings.",
        'visitors': "Welcome and track your business visitors."
      };
      
      return sectionMessages[section] || 
             (sectionConfig ? `Manage your ${sectionConfig.title.toLowerCase()}.` : "Welcome to your business dashboard.");
    }
    
    const tabMessages = {
      'dashboard': "Your central hub for all networking activities and insights.",
      'business': "Manage your business opportunities, meetings, and connections.",
      'professional': "Develop your professional skills and career opportunities.",
      'social': "Connect and engage with your network community.",
      'groups': "Join and participate in specialized networking groups.",
      'settings': "Configure your profile and application preferences."
    };
    
    return tabMessages[tab] || "Welcome to the EKAM Global Network.";
  };

  const renderMainContent = () => {
    // If a business section is selected or business closed form is shown, show the business content
    if (tab === 'business' && (section || showBusinessClosedForm)) {
      return renderBusinessContent();
    }

    // Handle other main tabs
    switch (tab) {
      case 'dashboard':
        return (
          <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-slate-700 mb-4 flex justify-center">
                <Building />
              </div>
              <h2 className="text-2xl font-semibold text-slate-500 mb-2">
                Dashboard
              </h2>
              <p className="text-slate-600">
                Your comprehensive business dashboard is coming soon.
              </p>
            </div>
          </div>
        );
      
      case 'professional':
        return (
          <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-slate-700 mb-4 flex justify-center">
                <GraduationCap />
              </div>
              <h2 className="text-2xl font-semibold text-slate-500 mb-2">
                Professional Development
              </h2>
              <p className="text-slate-600">
                Professional development tools and resources coming soon.
              </p>
            </div>
          </div>
        );
      
      case 'social':
        return (
          <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-slate-700 mb-4 flex justify-center">
                <Heart />
              </div>
              <h2 className="text-2xl font-semibold text-slate-500 mb-2">
                Social Network
              </h2>
              <p className="text-slate-600">
                Social networking features coming soon.
              </p>
            </div>
          </div>
        );
      
      case 'groups':
        return (
          <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-slate-700 mb-4 flex justify-center">
                <Users />
              </div>
              <h2 className="text-2xl font-semibold text-slate-500 mb-2">
                Groups
              </h2>
              <p className="text-slate-600">
                Group management features coming soon.
              </p>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-slate-700 mb-4 flex justify-center">
                <Settings />
              </div>
              <h2 className="text-2xl font-semibold text-slate-500 mb-2">
                Settings
              </h2>
              <p className="text-slate-600">
                Application settings coming soon.
              </p>
            </div>
          </div>
        );
      
      default:
        // Default welcome screen
        return (
          <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-slate-700 mb-4 flex justify-center">
                <Handshake />
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
                <button 
                  onClick={() => handleTabClick('business')}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        );
    }
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
          <Bell className="text-gray-600 text-xl cursor-pointer hover:text-orange-500 transition-colors" />
          
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
              <ChevronDown className={`text-gray-600 text-sm transition-transform ${
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
                    <User className="text-sm w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Cog className="text-sm w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                  >
                    <LogOut className="text-sm w-4 h-4" />
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
          {navigationTabs.map((tabItem) => (
            <div key={tabItem.id} className="flex-1">
              <button
                onClick={() => handleTabClick(tabItem.id)}
                className={`w-full px-6 py-4 flex items-center justify-center space-x-2 transition-all duration-300 ${
                  tab === tabItem.id
                    ? 'bg-slate-800 text-orange-400 border-b-2 border-orange-500'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tabItem.icon className="text-sm w-4 h-4" />
                <span>{tabItem.label}</span>
                {tabItem.id === 'business' && (
                  <ChevronDown className={`text-xs w-3 h-3 transition-transform ${
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
                  section === item.id
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <item.icon className="text-sm flex-shrink-0 w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Home;