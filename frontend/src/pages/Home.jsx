// components/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Bell, User, ChevronDown, Handshake, Building, 
  GraduationCap, Heart, Users, Settings, ArrowLeftRight,
  CalendarDays, Eye, MessageSquare, Rss, Users2, LogOut,
  UserPlus, Star, Globe, Share, Cog
} from 'lucide-react';

// Import the components
import { DataTable, DataForm } from '../components/DataTable';
import { businessSections, BusinessSectionManager } from '../config/businessSections';
import { ConnectionsComponent, TestimonialsComponent } from '../components/ConnectionsTestimonialsComponents';
import MyFeedComponent from '../components/MyFeed/MyFeed';
import BusinessOpportunityReceived from '../components/BussinessOpertunityReceived';
import {
  useP2PData,
  useBusinessOpportunitiesGivenData,
  useBusinessClosedData,
  useMeetingsData,
  useVisitorsData,
  useMyFeedsData,
  useOneToManyData,
  useUpcomingEventsData
} from '../config/BusinessData';

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

  // Call hooks for all sections except business-opportunity-received (now separate)
  const p2pData = useP2PData();
  const businessOpportunitiesGivenData = useBusinessOpportunitiesGivenData();
  const businessClosedData = useBusinessClosedData();
  const meetingsData = useMeetingsData();
  const visitorsData = useVisitorsData();
  const myFeedsData = useMyFeedsData();
  const oneToManyData = useOneToManyData();
  const upcomingEventsData = useUpcomingEventsData();

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

  // Reset selected item when section changes
  useEffect(() => {
    setSelectedItem(null);
    setShowBusinessClosedForm(false);
    setBusinessClosedSourceItem(null);
    // Clear editing state when section changes
    const sectionData = getSectionData(section);
    if (sectionData && sectionData.cancelEdit) {
      sectionData.cancelEdit();
    }
  }, [section]);

  // Add global handler for business closed
  useEffect(() => {
    window.handleAddBusinessClosed = (sourceItem) => {
      setBusinessClosedSourceItem(sourceItem);
      setShowBusinessClosedForm(true);
      navigate('/home/business/business-closed');
    };
    
    return () => {
      delete window.handleAddBusinessClosed;
    };
  }, [navigate]);

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

  // Business section handlers (for non-separated components)
  const handleAddNew = () => {
    const sectionData = getSectionData(section);
    if (sectionData && sectionData.cancelEdit) {
      sectionData.cancelEdit();
    }
    navigate(`/home/business/${section}/form`);
    setSelectedItem(null);
    setShowBusinessClosedForm(false);
    setBusinessClosedSourceItem(null);
  };

  const handleEdit = (item) => {
    console.log('Edit clicked for item:', item);
    const sectionData = getSectionData(section);
    
    if (sectionData && sectionData.startEdit) {
      sectionData.startEdit(item);
      console.log('Edit state set, navigating to form...');
      navigate(`/home/business/${section}/form`);
      setSelectedItem(null);
      setShowBusinessClosedForm(false);
      setBusinessClosedSourceItem(null);
    } else {
      console.error('startEdit function not available for section:', section);
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    console.log('View item:', item);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const sectionData = getSectionData(section);
        await sectionData.deleteItem(item.id);
        console.log('Item deleted successfully');
        setDataUpdateTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item. Please try again.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const sectionData = getSectionData(section);

      if (sectionData.editingId) {
        console.log('Updating item with ID:', sectionData.editingId);
        console.log('Form data:', formData);
        await sectionData.saveEdit(formData);
        console.log('Item updated successfully');
      } else {
        console.log('Adding new item with data:', formData);
        await sectionData.addItem(formData);
        console.log('Item added successfully');
      }

      navigate(`/home/business/${section}`);
      setDataUpdateTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const handleFormCancel = () => {
    const sectionData = getSectionData(section);
    if (sectionData && sectionData.cancelEdit) {
      sectionData.cancelEdit();
    }
    
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

  // Get current section configuration
  const getCurrentSectionConfig = () => {
    if (!section) return null;
    return BusinessSectionManager.getSectionConfig(section);
  };

  // Helper function to get the correct data based on section (excluding business-opportunity-received)
  const getSectionData = (sectionId) => {
    switch (sectionId) {
      case 'p2p':
        return p2pData;
      case 'business-opportunity-given':
        return businessOpportunitiesGivenData;
      case 'business-closed':
        return businessClosedData;
      case 'meetings':
        return meetingsData;
      case 'visitors':
        return visitorsData;
      case 'one-to-many':
        return oneToManyData;
      case 'upcoming-events':
        return upcomingEventsData;
      default:
        return { data: [], loading: false, error: null };
    }
  };

  const renderDataSection = (sectionId) => {
    const { data, loading, error } = getSectionData(sectionId);
    const sectionConfig = getCurrentSectionConfig();

    if (loading) {
      return (
        <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading {sectionConfig?.title || sectionId}...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-red-500 mb-4 flex justify-center">
              <Handshake />
            </div>
            <h2 className="text-2xl font-semibold text-red-500 mb-2">
              Error Loading Data
            </h2>
            <p className="text-slate-400">
              {error}
            </p>
          </div>
        </div>
      );
    }

    if (sectionConfig && sectionConfig.tableConfig) {
      return (
        <DataTable
          title={sectionConfig.title}
          data={data || []}
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
          key={`${sectionId}-${dataUpdateTrigger}`}
        />
      );
    }

    return (
      <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-slate-700 mb-4 flex justify-center">
            <Handshake />
          </div>
          <h2 className="text-2xl font-semibold text-slate-500 mb-2">
            {sectionConfig?.title || sectionId?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Section'}
          </h2>
          <p className="text-slate-600">
            This section is under development.
          </p>
        </div>
      </div>
    );
  };

  const renderBusinessContent = () => {
    // Handle specific business sections with custom components first
    switch (section) {
      case 'business-opportunity-received':
        // Use the separate component
        return <BusinessOpportunityReceived />;
      case 'connections':
        return <ConnectionsComponent />;
      case 'testimonials':
        return <TestimonialsComponent />;
      case 'my-feeds':
        return <MyFeedComponent userId={user?.id} />;
    }

    // Handle Business Closed form (global handler)
    if (showBusinessClosedForm && section === 'business-closed') {
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
          onSubmit={async (formData) => {
            try {
              await businessClosedData.addItem(formData);
              setShowBusinessClosedForm(false);
              setBusinessClosedSourceItem(null);
              console.log('Business Closed added successfully');
              setDataUpdateTrigger(prev => prev + 1);
            } catch (error) {
              console.error('Error adding Business Closed:', error);
              alert('Error adding Business Closed. Please try again.');
            }
          }}
          onCancel={() => {
            setShowBusinessClosedForm(false);
            setBusinessClosedSourceItem(null);
            navigate(`/home/business/${section}`);
          }}
          submitText={businessClosedConfig.formConfig.submitText}
          cancelText={businessClosedConfig.formConfig.cancelText}
        />
      );
    }

    // Handle regular form views (URL-based) for other sections
    if (view === 'form' && section && section !== 'business-opportunity-received') {
      const sectionConfig = getCurrentSectionConfig();
      const sectionData = getSectionData(section);
      
      if (!sectionConfig || !sectionConfig.formConfig) {
        return (
          <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-red-500 mb-4 flex justify-center">
                <Handshake />
              </div>
              <h2 className="text-2xl font-semibold text-red-500 mb-2">
                Form Configuration Error
              </h2>
              <p className="text-slate-400">
                Form configuration not found for {section}.
              </p>
              <button 
                onClick={() => navigate(`/home/business/${section}`)}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Back to Table
              </button>
            </div>
          </div>
        );
      }

      const isEditing = !!sectionData.editingId;
      console.log('Rendering form. Is editing:', isEditing);
      console.log('Edit form data:', sectionData.editForm);

      return (
        <DataForm
          title={isEditing ? `Edit ${sectionConfig.title}` : sectionConfig.formConfig.title}
          fields={sectionConfig.formConfig.fields}
          editFields={sectionConfig.formConfig.editFields}
          initialData={isEditing ? sectionData.editForm : {}}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          submitText={isEditing ? 'Update' : sectionConfig.formConfig.submitText}
          cancelText={sectionConfig.formConfig.cancelText}
          isEdit={isEditing}
        />
      );
    }

    // Handle data table views for specific sections (excluding business-opportunity-received)
    const dataSections = [
      'p2p', 'business-opportunity-given', 
      'business-closed', 'meetings', 'visitors', 'one-to-many', 'upcoming-events'
    ];

    if (section && dataSections.includes(section)) {
      return renderDataSection(section);
    }

    // Default fallback for unsupported sections
    const sectionConfig = getCurrentSectionConfig();
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
            {view === 'form' ? 'Form view not available for this section.' : 'This section is under development.'}
          </p>
          {view === 'form' && (
            <button 
              onClick={() => navigate(`/home/business/${section}`)}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Back to Table
            </button>
          )}
        </div>
      </div>
    );
  };

  const getWelcomeMessage = () => {
    if (tab === 'business' && section) {
      const sectionConfig = getCurrentSectionConfig();
      
      const sectionMessages = {
        'connections': "Build and manage your professional network connections.",
        'testimonials': "Showcase and manage testimonials from your network.",
        'p2p': "Manage peer-to-peer business opportunities.",
        'meetings': "Schedule and track your business meetings.",
        'visitors': "Welcome and track your business visitors.",
        'business-opportunity-received': "Manage received business opportunities."
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-grey-800/30 text-gray-900  flex items-center justify-between"> 
        <div className="flex items-center">
          <img
      src="../../assests/Screenshot (100).png"
      alt="EKAM Logo"
      className=" h-23 object-cover" 
    />
        </div>
        
        <div className="flex items-center space-x-4">
          <Bell className="text-gray-100 scale-y-[1.2] text-xl cursor-pointer hover:text-orange-500 transition-colors" />
          
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 cursor-pointer bg-white/20 mr-5 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8  bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <span className="font-medium text-gray-100">
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
      <div className="relative dropdown-container bg-gradient-to-b from-gray-950 border-t-white/20 border-t-[.1px] to-gray-900 flex items-center justify-around">
        {navigationTabs.map((tabItem) => {
          const isActiveTab = tab === tabItem.id || (tabItem.id === 'business' && tab === 'business');
const IconComponent = tabItem.icon;

return (
  <div key={tabItem.id} className="relative">
    <button
      onClick={() => handleTabClick(tabItem.id)}
      className={`flex items-center space-x-2 px-6 py-4 transition-all duration-200 ${
        isActiveTab 
          ? 'text-orange-500 border-b-2 border-orange-500' 
          : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      <IconComponent className="w-5 h-5" />
      <span className="font-medium">{tabItem.label}</span>
      {tabItem.id === 'business' && (
        <ChevronDown className={`w-4 h-4 transition-transform ${
          activeDropdown === 'business' ? 'rotate-180' : ''
        }`} />
      )}
    </button>

    {/* Business Dropdown Menu */}
  {tabItem.id === 'business' && activeDropdown === 'business' && (
  <div className="absolute top-full left-0 mt-1 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-40">
    <div className="p-4">
      
      <div className="space-y-2">
        {businessSubmenu.map((subItem) => {
          const SubIcon = subItem.icon;
          const isActiveSubmenu = section === subItem.id;
          
          return (
            <button
              key={subItem.id}
              onClick={() => handleSubmenuClick(subItem.id)}
              className={`flex  items-center space-x-3 px-3 py-1 rounded-lg transition-colors w-full ${
                isActiveSubmenu
                  ? 'bg-gray-500/20  text-gray-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
              }`}
            >
              <span className="text-sm font-medium text-left">{subItem.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
)}
  </div>
);
})}
</div>

{/* Main Content Area */}
<div className="flex-1 px-6">
 

  {/* Content */}
  {renderMainContent()}
</div>

{/* Selected Item Modal */}
{selectedItem && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Item Details</h3>
          <button 
            onClick={() => setSelectedItem(null)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          {Object.entries(selectedItem).map(([key, value]) => (
            <div key={key} className="flex">
              <span className="font-medium text-gray-300 w-32 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <span className="text-white flex-1">
                {value || '-'}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => handleEdit(selectedItem)}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Edit
          </button>
          <button
            onClick={() => setSelectedItem(null)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
</div>
);
};

export default Home;