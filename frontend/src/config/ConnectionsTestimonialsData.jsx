// components/ConnectionsTestimonialsData.js
// This file contains all the data and business logic
import React from 'react';

// Sample data for connections
export const connectionsData = {
  myConnections: 67,
  sentRequests: 2,
  receivedRequests: 1,
  connections: [
    {
      id: 1,
      name: 'Clark Ron',
      title: 'Legal & Accounting | Tax Advisor',
      company: 'TEAM ABC',
      avatar: '/api/placeholder/60/60',
      status: 'connected',
      location: 'New York, NY'
    },
    {
      id: 2,
      name: 'Olivia',
      title: 'Health & Wellness | Dentist',
      company: 'TEAM ABC',
      avatar: '/api/placeholder/60/60',
      status: 'connected',
      location: 'Los Angeles, CA'
    },
    {
      id: 3,
      name: 'Peter Hen',
      title: 'Vice President',
      company: 'TEAM ABC',
      avatar: '/api/placeholder/60/60',
      status: 'connected',
      location: 'Chicago, IL'
    },
    {
      id: 4,
      name: 'Emma John',
      title: 'Director',
      company: 'TEAM ABC',
      avatar: '/api/placeholder/60/60',
      status: 'connected',
      location: 'Miami, FL'
    },
    {
      id: 5,
      name: 'Mark Luce',
      title: 'Financial Head',
      company: 'TEAM ABC',
      avatar: '/api/placeholder/60/60',
      status: 'connected',
      location: 'Seattle, WA'
    },
    {
      id: 6,
      name: 'Isabella',
      title: 'Training & Coaching | Education',
      company: 'TEAM ABC',
      avatar: '/api/placeholder/60/60',
      status: 'connected',
      location: 'Austin, TX'
    }
  ],
  sentRequestsList: [
    {
      id: 101,
      name: 'John Smith',
      title: 'Marketing Manager',
      company: 'TECH CORP',
      avatar: '/api/placeholder/60/60',
      status: 'pending-sent',
      location: 'Boston, MA',
      requestDate: '3 days ago'
    },
    {
      id: 102,
      name: 'Sarah Wilson',
      title: 'Product Designer',
      company: 'DESIGN CO',
      avatar: '/api/placeholder/60/60',
      status: 'pending-sent',
      location: 'San Francisco, CA',
      requestDate: '1 week ago'
    }
  ],
  receivedRequestsList: [
    {
      id: 201,
      name: 'Mike Johnson',
      title: 'Sales Director',
      company: 'SALES INC',
      avatar: '/api/placeholder/60/60',
      status: 'pending-received',
      location: 'Denver, CO',
      requestDate: '2 days ago'
    }
  ]
};

// Sample data for testimonials
export const testimonialsData = {
  testimonialsReceived: 2,
  testimonialsGiven: 2,
  testimonialsRequests: 1,
  testimonials: [
    {
      id: 1,
      name: 'Clark Ron',
      avatar: '/api/placeholder/60/60',
      role: 'Tax Advisor',
      company: 'TEAM ABC',
      testimonial: 'Working with Mark has been an absolute pleasure. His vision, dedication, and innovative approach to business are truly inspiring. He not only delivers results but also builds strong trustworthy relationships with clients and partners.',
      date: '2 weeks ago',
      rating: 5
    },
    {
      id: 2,
      name: 'Olivia',
      avatar: '/api/placeholder/60/60',
      role: 'Dentist',
      company: 'TEAM ABC',
      testimonial: 'Mark\'s professional expertise and collaborative spirit make him an exceptional business partner. His ability to understand complex requirements and deliver innovative solutions consistently exceeds expectations.',
      date: '1 month ago',
      rating: 5
    }
  ],
   testimonialsGivenList: [
    {
      id: 301,
      name: 'Michael Chen',
      avatar: '/api/placeholder/60/60',
      role: 'Business Partner',
      company: 'PARTNER CO',
      testimonial: 'I provided this testimonial for Michael. Great collaboration and results.',
      date: '1 week ago',
      rating: 5,
      type: 'given'
    }
  ],
  testimonialsRequestsList: [
    {
      id: 401,
      name: 'Jennifer Walsh',
      avatar: '/api/placeholder/60/60',
      role: 'Client',
      company: 'CLIENT INC',
      requestDate: '3 days ago',
      status: 'pending',
      type: 'request'
    }
  ]
};

// Business logic functions for connections
export const connectionsService = {
  // Filter connections based on search term
  filterConnections: (searchTerm) => {
    return connectionsData.connections.filter(connection =>
      connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // Get connections by type with search
  getConnectionsByType: (type, searchTerm = '') => {
    let data = [];
    switch(type) {
      case 'myConnections':
        data = connectionsData.connections;
        break;
      case 'sentRequests':
        data = connectionsData.sentRequestsList;
        break;
      case 'receivedRequests':
        data = connectionsData.receivedRequestsList;
        break;
      default:
        data = connectionsData.connections;
    }
    
    return data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // Get connection by ID
  getConnectionById: (id) => {
    return connectionsData.connections.find(connection => connection.id === id);
  },

  // Add new connection
  addConnection: (connectionData) => {
    const newConnection = {
      id: Math.max(...connectionsData.connections.map(c => c.id)) + 1,
      ...connectionData,
      status: 'connected'
    };
    connectionsData.connections.push(newConnection);
    connectionsData.myConnections++;
    return newConnection;
  },

  // Update connection
  updateConnection: (id, updateData) => {
    const index = connectionsData.connections.findIndex(c => c.id === id);
    if (index !== -1) {
      connectionsData.connections[index] = { ...connectionsData.connections[index], ...updateData };
      return connectionsData.connections[index];
    }
    return null;
  },

  // Remove connection
  removeConnection: (id) => {
    const index = connectionsData.connections.findIndex(c => c.id === id);
    if (index !== -1) {
      connectionsData.connections.splice(index, 1);
      connectionsData.myConnections--;
      return true;
    }
    return false;
  },

  // Send connection request
  sendConnectionRequest: (userId) => {
    connectionsData.sentRequests++;
    console.log('Connection request sent to user:', userId);
  },

  // Accept connection request
  acceptConnectionRequest: (userId) => {
    connectionsData.receivedRequests--;
    connectionsData.myConnections++;
    console.log('Connection request accepted from user:', userId);
  },

  // Get stats
  getStats: () => ({
    myConnections: connectionsData.myConnections,
    sentRequests: connectionsData.sentRequests,
    receivedRequests: connectionsData.receivedRequests
  })
};

// Business logic functions for testimonials
export const testimonialsService = {
  // Filter testimonials based on search term
  filterTestimonials: (searchTerm) => {
    return testimonialsData.testimonials.filter(testimonial =>
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // Get testimonial by ID
  getTestimonialById: (id) => {
    return testimonialsData.testimonials.find(testimonial => testimonial.id === id);
  },
  // Add this to testimonialsService
getTestimonialsByType: (type, searchTerm = '') => {
  let data = [];
  switch(type) {
    case 'testimonialsReceived':
      data = testimonialsData.testimonials;
      break;
    case 'testimonialsGiven':
      data = testimonialsData.testimonialsGivenList;
      break;
    case 'testimonialsRequests':
      data = testimonialsData.testimonialsRequestsList;
      break;
    default:
      data = testimonialsData.testimonials;
  }
  
  return data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.testimonial && item.testimonial.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.role && item.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );
},

  // Add new testimonial
  addTestimonial: (testimonialData) => {
    const newTestimonial = {
      id: Math.max(...testimonialsData.testimonials.map(t => t.id)) + 1,
      ...testimonialData,
      date: 'Just now',
      rating: testimonialData.rating || 5
    };
    testimonialsData.testimonials.push(newTestimonial);
    testimonialsData.testimonialsReceived++;
    return newTestimonial;
  },

  // Update testimonial
  updateTestimonial: (id, updateData) => {
    const index = testimonialsData.testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
      testimonialsData.testimonials[index] = { ...testimonialsData.testimonials[index], ...updateData };
      return testimonialsData.testimonials[index];
    }
    return null;
  },

  // Remove testimonial
  removeTestimonial: (id) => {
    const index = testimonialsData.testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
      testimonialsData.testimonials.splice(index, 1);
      testimonialsData.testimonialsReceived--;
      return true;
    }
    return false;
  },

  // Request testimonial
  requestTestimonial: (userId, message) => {
    testimonialsData.testimonialsRequests++;
    console.log('Testimonial requested from user:', userId, 'with message:', message);
  },

  // Give testimonial
  giveTestimonial: (userId, testimonialText, rating) => {
    testimonialsData.testimonialsGiven++;
    console.log('Testimonial given to user:', userId, 'rating:', rating);
  },

  // Share testimonial
  shareTestimonial: (id, platform) => {
    const testimonial = testimonialsService.getTestimonialById(id);
    if (testimonial) {
      console.log('Sharing testimonial:', testimonial.id, 'on platform:', platform);
      return true;
    }
    return false;
  },

  // Thank for testimonial
  thankForTestimonial: (id) => {
    const testimonial = testimonialsService.getTestimonialById(id);
    if (testimonial) {
      console.log('Thanked for testimonial:', testimonial.id);
      return true;
    }
    return false;
  },

  // Get stats
  getStats: () => ({
    testimonialsReceived: testimonialsData.testimonialsReceived,
    testimonialsGiven: testimonialsData.testimonialsGiven,
    testimonialsRequests: testimonialsData.testimonialsRequests
  })
};

// Utility functions
export const utils = {
  // Format date
  formatDate: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  },

  // Generate avatar fallback
  getAvatarFallback: (name) => {
    return name?.charAt(0)?.toUpperCase() || '?';
  },

  // Truncate text
  truncateText: (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  },

  // Validate email
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Generate random ID
  generateId: () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  },

  // Sort array by key
  sortBy: (array, key, direction = 'asc') => {
    return array.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  },

  // Search in object
  searchInObject: (obj, searchTerm) => {
    const term = searchTerm.toLowerCase();
    return Object.values(obj).some(value => 
      typeof value === 'string' && value.toLowerCase().includes(term)
    );
  }
};

// Export all data and services
export default {
  connectionsData,
  testimonialsData,
  connectionsService,
  testimonialsService,
  utils
};