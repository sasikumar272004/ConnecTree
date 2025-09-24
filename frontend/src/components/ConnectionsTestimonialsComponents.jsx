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
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  if (imageError || !src) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-semibold ${textSizes[size]} flex-shrink-0 shadow-md`}>
        {name?.charAt(0)?.toUpperCase() || '?'}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-slate-700 rounded-full flex-shrink-0 overflow-hidden shadow-md ring-2 ring-slate-800`}>
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
    className={`${isActive ? 'bg-gradient-to-r from-orange-600 to-orange-700' : 'bg-slate-900 border border-slate-800'} rounded-lg p-4 text-white relative overflow-hidden transition-all hover:scale-[1.02] shadow-lg cursor-pointer`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium mb-1 opacity-80">{title}</h3>
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toString().padStart(2, '0') : value}</div>
      </div>
      <div className={`${isActive ? 'text-white/20' : 'text-white/15'}`}>
        <Icon className="w-8 h-8" />
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
    <h1 className="text-2xl font-bold text-white">{title}</h1>
  </div>
);

// Action Buttons Component
const ActionButtons = ({ onSearch, onPrimaryAction, searchText = "Search", primaryText, primaryIcon: PrimaryIcon }) => (
  <div className="flex gap-2">
    <button
      onClick={onSearch}
      className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm border border-slate-700"
    >
      <Search className="w-3 h-3" />
      {searchText}
    </button>
    <button
      onClick={onPrimaryAction}
      className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 text-sm shadow-lg"
    >
      <PrimaryIcon className="w-3 h-3" />
      {primaryText}
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
  <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 hover:border-slate-700 transition-all hover:shadow-lg hover:bg-slate-800/50">
    <div className="flex items-start gap-3">
      <Avatar src={connection.avatar} name={connection.name} size="md" />
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-base mb-1 truncate">{connection.name}</h3>
        <p className="text-slate-400 text-xs mb-1 line-clamp-2">{connection.title}</p>
        <p className="text-orange-500 text-xs font-medium mb-1">{connection.company}</p>
        <p className="text-slate-600 text-xs mb-3">{connection.location}</p>
        {connection.requestDate && (
          <p className="text-slate-600 text-xs mb-3">Request: {connection.requestDate}</p>
        )}
        <div className="flex gap-1.5">
          <button
            onClick={() => onViewProfile(connection.id)}
            className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded text-xs transition-colors flex items-center gap-1 flex-1 justify-center border border-slate-700"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
          <button
            onClick={() => onSendMessage(connection.id)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-2.5 py-1.5 rounded text-xs transition-colors flex items-center gap-1 flex-1 justify-center"
          >
            <MessageCircle className="w-3 h-3" />
            {connection.status === 'pending-sent' ? 'Cancel' : 
             connection.status === 'pending-received' ? 'Accept' : 'Message'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ testimonial, onShare, onThank }) => (
  <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 hover:border-slate-700 transition-all hover:shadow-lg hover:bg-slate-800/50">
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={testimonial.avatar} name={testimonial.name} size="md" />
        <div className="flex-1">
          <h3 className="text-white font-semibold text-base mb-1">{testimonial.name}</h3>
          <p className="text-slate-400 text-xs mb-0.5">{testimonial.role}</p>
          <p className="text-orange-500 text-xs font-medium">{testimonial.company}</p>
        </div>
      </div>

      {/* Rating and Date */}
      <div className="flex items-center justify-between mb-3">
        <StarRating rating={testimonial.rating} />
        <span className="text-slate-600 text-xs">{testimonial.date}</span>
      </div>

      {/* Testimonial Content */}
      <div className="relative mb-4">
        <Quote className="text-orange-500/20 w-6 h-6 mb-2" />
        <p className="text-slate-300 text-xs leading-relaxed italic pl-3 border-l-2 border-orange-500/20">
          {testimonial.testimonial}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-slate-800">
        <button 
          onClick={() => onShare(testimonial.id)}
          className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-xs transition-colors flex-1 border border-slate-700"
        >
          Share
        </button>
        <button 
          onClick={() => onThank(testimonial.id)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded text-xs transition-colors flex-1"
        >
          Thank
        </button>
      </div>
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
    <div className="bg-slate-950 p-4 min-h-screen">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

// Demo Component to show both
export default function ConnectionsTestimonialsDemo() {
  const [activeTab, setActiveTab] = useState(() =>
    getStateFromLocalStorage('connectionsDemo_activeTab', 'connections')
  );

  // Save tab state when it changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    saveStateToLocalStorage('connectionsDemo_activeTab', tab);
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="flex">
          <button
            onClick={() => handleTabChange('connections')}
            className={`px-4 py-3 font-medium transition-colors text-sm ${
              activeTab === 'connections'
                ? 'text-orange-500 border-b-2 border-orange-500 bg-slate-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Connections
          </button>
          <button
            onClick={() => handleTabChange('testimonials')}
            className={`px-4 py-3 font-medium transition-colors text-sm ${
              activeTab === 'testimonials'
                ? 'text-orange-500 border-b-2 border-orange-500 bg-slate-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Testimonials
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'connections' ? <ConnectionsComponent /> : <TestimonialsComponent />}
    </div>
  );
}