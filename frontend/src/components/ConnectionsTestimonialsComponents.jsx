// components/ConnectionsTestimonialsComponents.js
// This file contains all the UI components and layouts

import React, { useState, useMemo } from 'react';

// State persistence utilities
const saveStateToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
};

const getStateFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.warn('Failed to get state from localStorage:', error);
    return defaultValue;
  }
};

import { Search, Users, UserPlus, UserCheck, MessageCircle, Eye, Quote } from 'lucide-react';
import { useConnectionsData, useTestimonialsData } from '../config/ConnectionsTestimonialsData';

// Avatar component with fallback
const Avatar = ({ src, name, size = 'md' }) => {
  const [imageError, setImageError] = useState(false);
  
 

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  if (imageError || !src) {
    return (
      <div className={` h-28 w-[30%] bg-gradient-to-br from-orange-500 to-orange-700  flex items-center justify-center text-white font-semibold ${textSizes[size]} flex-shrink-0 shadow-md`}>
        {name?.charAt(0)?.toUpperCase() || '?'}
      </div>
    );
  }

  return (
    <div className={` bg-slate-700 rounded-full flex-shrink-0 overflow-hidden shadow-md ring-2 ring-slate-800`}>
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, isHighlighted = false, hasIndicator = false, onClick, isActive = false }) => (
  <div 
    className={`${isActive ? 'bg-gradient-to-r from-orange-500 to-orange-500' : 'bg-gray-900 border border-orange-400'} rounded-lg p-4 text-white relative overflow-hidden transition-all hover:scale-[1.02] shadow-lg cursor-pointer`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className='py-1'>
        <h3 className="text-2xl font-medium mb-1 opacity-80">{title}</h3>
        <div className="text-3xl font-bold">{typeof value === 'number' ? value.toString().padStart(2, '0') : value}</div>
      </div>
      <div className={`${isActive ? 'text-white/50' : 'text-white/30'}`}>
        <Icon className="w-8 text-amber-50 h-8" />
      </div>
    </div>
    {hasIndicator && (
      <div className="absolute top-3 right-3">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
      </div>
    )}
  </div>
);

// Star Rating Component
const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <div
        key={star}
        className={`w-3 h-3 ${star <= rating ? 'text-orange-500' : 'text-slate-700'}`}
      >
        ★
      </div>
    ))}
  </div>
);

// Search Bar Component
const SearchBar = ({ searchTerm, setSearchTerm, onSearch, placeholder }) => (
  <div className="flex-1 relative max-w-sm">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
    <input
      type="text"
      placeholder={placeholder}
      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && onSearch()}
    />
  </div>
);

// Page Header Component
const PageHeader = ({ breadcrumb, title }) => (
  <div className="mb-6">
    <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
      <span>Business</span>
      <span>›</span>
      <span className="text-orange-500 font-medium">{breadcrumb}</span>
    </div>
  </div>
);

// Action Buttons Component
const ActionButtons = ({ onSearch, onPrimaryAction, searchText = "Search", primaryText, primaryIcon: PrimaryIcon }) => (
  <div className="flex gap-2">
    <button
      onClick={onSearch}
      className="bg-orange-500 hover:bg-slate-700 text-white px-10 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm border border-slate-700"
    >
      <Search className="w-3 h-3" />
      {searchText}
    </button>
   
  </div>
);

// Results Count Component
const ResultsCount = ({ current, total, itemType }) => (
  <div className="mb-4">
    <p className="text-slate-500 text-sm">
      Showing {current} of {total} {itemType}
    </p>
  </div>
);

// Empty State Component
const EmptyState = ({ icon: Icon, message }) => (
  <div className="text-center py-12">
    <Icon className="w-10 h-10 text-slate-700 mx-auto mb-3" />
    <p className="text-slate-500 text-sm">{message}</p>
  </div>
);

// Connection Card Component
const ConnectionCard = ({ connection, onViewProfile, onSendMessage }) => (
   <div className="relative max-w-4xl w-full rounded-2xl p-[1px] bg-gradient-to-br from-gray-200 via-gray-700 to-gray-800">
  <div className="bg-slate-900 border rounded-2xl overflow-hidden border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg hover:bg-slate-800/50">
    <div className="flex items-start gap-3">
      <Avatar src={connection.avatar} name={connection.name} size="md" />
      <div className="flex-1 py-2 min-w-0">
        <h3 className="text-white font-semibold text-base mb-1 truncate">{connection.name}</h3>
        <p className="text-slate-400 text-xs mb-1 line-clamp-2">{connection.title}</p>
        <p className="text-orange-500 text-xs font-medium mb-1">{connection.company}</p>
        {connection.requestDate && (
          <p className="text-slate-600 text-xs mb-3">Request: {connection.requestDate}</p>
        )}
        <div className="flex gap-1.5 content-start pr-5">
          <button
            onClick={() => onViewProfile(connection.id)}
            className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded text-xs transition-colors flex items-center gap-1 flex-1 justify-center border border-orange-500"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
          <button
            onClick={() => onSendMessage(connection.id)}
            className="bg-gray-500 text-white px-2.5 py-1.5 rounded text-xs transition-colors flex items-center gap-1 flex-1 justify-center"
          >
            <MessageCircle className="w-3 h-3" />
            {connection.status === 'pending-sent' ? 'Cancel' : 
             connection.status === 'pending-received' ? 'Accept' : 'Message'}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
);

// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => (
  <div className="bg-gradient-to-br from-slate-900 to-gray-800 rounded-2xl border mt-7 border-slate-800 p-6 text-center hover:border-slate-700 transition-all hover:shadow-lg hover:bg-slate-800/50 relative">

   {/* Avatar (Name as Circle) */}
<div className="flex justify-center -mt-14 px-5">
  <div className="w-30 h-30 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-900   to-gray-800 text-white text-xl font-bold ">
<div className='bg-amber-600 w-22 h-22 rounded-full flex items-center justify-center'>
      {testimonial.name.charAt(0)} {/* or full name if you want */}

</div>
  </div>
</div>

{/* Name below */}
<h3 className="text-orange-500 font-semibold text-xl  text-center">
  {testimonial.name}
</h3>


    {/* Name */}

    {/* Testimonial */}
    <div className="relative mt-3">
      <span className="absolute -left-2 -top-2 text-orange-500 text-3xl">❝</span>
      <p className="text-slate-300 text-sm  leading-relaxed italic px-6">
        {testimonial.testimonial}
      </p>
      <span className="absolute -right-2 -bottom-2 text-orange-500 text-3xl">❞</span>
    </div>
  </div>
);


// Connections Component
export const ConnectionsComponent = () => {
  const [searchTerm, setSearchTerm] = useState(() =>
    getStateFromLocalStorage('connections_searchTerm', '')
  );
  const [activeMetric, setActiveMetric] = useState(() =>
    getStateFromLocalStorage('connections_activeMetric', 'myConnections')
  );

  const { connections, loading, error } = useConnectionsData();

  // Filter connections based on active metric and search term
  const filteredConnections = useMemo(() => {
    let filtered = connections;

    // Filter by type
    switch(activeMetric) {
      case 'myConnections':
        filtered = connections.filter(conn => conn.status === 'connected');
        break;
      case 'sentRequests':
        filtered = connections.filter(conn => conn.status === 'pending-sent');
        break;
      case 'receivedRequests':
        filtered = connections.filter(conn => conn.status === 'pending-received');
        break;
      default:
        filtered = connections;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(conn =>
        conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [connections, activeMetric, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => ({
    myConnections: connections.filter(conn => conn.status === 'connected').length,
    sentRequests: connections.filter(conn => conn.status === 'pending-sent').length,
    receivedRequests: connections.filter(conn => conn.status === 'pending-received').length
  }), [connections]);

  // Save states when they change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    saveStateToLocalStorage('connections_searchTerm', value);
  };

  const handleMetricChange = (metric) => {
    setActiveMetric(metric);
    saveStateToLocalStorage('connections_activeMetric', metric);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleAddConnection = () => {
    console.log('Adding new connection');
  };

  const handleViewProfile = (connectionId) => {
    console.log('Viewing profile for:', connectionId);
  };

  const handleSendMessage = (connectionId) => {
    console.log('Sending message to:', connectionId);
  };

  return (
    <div className="bg-slate-950 px-10 py-5 min-h-screen">
      <PageHeader breadcrumb="Connections" title="My Connections" />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="My Connections"
          value={stats.myConnections}
          icon={Users}
          isActive={activeMetric === 'myConnections'}
          onClick={() => handleMetricChange('myConnections')}
        />
        <StatsCard
          title="Sent Requests"
          value={stats.sentRequests}
          icon={UserPlus}
          hasIndicator={true}
          isActive={activeMetric === 'sentRequests'}
          onClick={() => handleMetricChange('sentRequests')}
        />
        <StatsCard
          title="Received Requests"
          value={stats.receivedRequests}
          icon={UserCheck}
          hasIndicator={true}
          isActive={activeMetric === 'receivedRequests'}
          onClick={() => handleMetricChange('receivedRequests')}
        />
      </div>

      {/* Search and Action Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          onSearch={handleSearch}
          placeholder="Search connections..."
        />
        <ActionButtons
          onSearch={handleSearch}
          onPrimaryAction={handleAddConnection}
          primaryText="Add Connection"
          primaryIcon={UserPlus}
        />
      </div>

      <ResultsCount
        current={filteredConnections.length}
        total={connections.length}
        itemType="connections"
      />

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {filteredConnections.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            onViewProfile={handleViewProfile}
            onSendMessage={handleSendMessage}
          />
        ))}
      </div>

      {filteredConnections.length === 0 && (
        <EmptyState
          icon={Users}
          message="No connections found matching your search."
        />
      )}
    </div>
  );
};

// Testimonials Component
export const TestimonialsComponent = () => {
  const [searchTerm, setSearchTerm] = useState(() =>
    getStateFromLocalStorage('testimonials_searchTerm', '')
  );
  const [activeMetric, setActiveMetric] = useState(() =>
    getStateFromLocalStorage('testimonials_activeMetric', 'testimonialsReceived')
  );

  const { testimonials, loading, error } = useTestimonialsData();

  // Filter testimonials based on active metric and search term
  const filteredTestimonials = useMemo(() => {
    let filtered = testimonials;

    // Filter by type
    switch(activeMetric) {
      case 'testimonialsReceived':
        filtered = testimonials.filter(test => test.type === 'received');
        break;
      case 'testimonialsGiven':
        filtered = testimonials.filter(test => test.type === 'given');
        break;
      case 'testimonialsRequests':
        filtered = testimonials.filter(test => test.type === 'request');
        break;
      default:
        filtered = testimonials;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testimonial.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [testimonials, activeMetric, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => ({
    testimonialsReceived: testimonials.filter(test => test.type === 'received').length,
    testimonialsGiven: testimonials.filter(test => test.type === 'given').length,
    testimonialsRequests: testimonials.filter(test => test.type === 'request').length
  }), [testimonials]);

  // Save states when they change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    saveStateToLocalStorage('testimonials_searchTerm', value);
  };

  const handleMetricChange = (metric) => {
    setActiveMetric(metric);
    saveStateToLocalStorage('testimonials_activeMetric', metric);
  };

  const handleSearch = () => {
    console.log('Searching testimonials for:', searchTerm);
  };

  const handleRequestTestimonial = () => {
    console.log('Requesting new testimonial');
  };

  const handleShare = (testimonialId) => {
    console.log('Sharing testimonial:', testimonialId);
  };

  const handleThank = (testimonialId) => {
    console.log('Thanking for testimonial:', testimonialId);
  };

  return (
    <div className="bg-slate-950 p-4 min-h-screen">
      <PageHeader breadcrumb="Testimonials" title="Testimonials" />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Testimonials Received"
          value={stats.testimonialsReceived}
          icon={Quote}
          isActive={activeMetric === 'testimonialsReceived'}
          hasIndicator={true}
          onClick={() => handleMetricChange('testimonialsReceived')}
        />
        <StatsCard
          title="Testimonials Given"
          value={stats.testimonialsGiven}
          icon={UserCheck}
          hasIndicator={true}
          isActive={activeMetric === 'testimonialsGiven'}
          onClick={() => handleMetricChange('testimonialsGiven')}
        />
        <StatsCard
          title="Pending Requests"
          value={stats.testimonialsRequests}
          icon={UserPlus}
          hasIndicator={true}
          isActive={activeMetric === 'testimonialsRequests'}
          onClick={() => handleMetricChange('testimonialsRequests')}
        />
      </div>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          onSearch={handleSearch}
          placeholder="Search testimonials..."
        />
        <ActionButtons
          onSearch={handleSearch}
          onPrimaryAction={handleRequestTestimonial}
          primaryText="Request Testimonial"
          primaryIcon={UserPlus}
        />
      </div>

      <ResultsCount
        current={filteredTestimonials.length}
        total={testimonials.length}
        itemType={`testimonial${filteredTestimonials.length !== 1 ? 's' : ''}`}
      />

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1  md:grid-cols-3 gap-10">
        {filteredTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${index}`}
            testimonial={testimonial}
            onShare={handleShare}
            onThank={handleThank}
          />
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <EmptyState
          icon={Quote}
          message="No testimonials found matching your search."
        />
      )}
    </div>
  );
};

