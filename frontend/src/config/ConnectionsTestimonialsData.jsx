// components/ConnectionsTestimonialsData.js
// This file contains all the data and business logic
import React, { useState, useEffect } from 'react';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API service functions
export const dataService = {
  // Generic function to fetch data from API
  fetchData: async (sectionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/data/${sectionId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error(`Error fetching ${sectionId} data:`, error);
      return [];
    }
  },

  // Generic function to create data
  createData: async (sectionId, data) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/data/${sectionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error creating ${sectionId} data:`, error);
      throw error;
    }
  },

  // Generic function to update data
  updateData: async (sectionId, id, data) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/data/${sectionId}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error updating ${sectionId} data:`, error);
      throw error;
    }
  },

  // Generic function to delete data
  deleteData: async (sectionId, id) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/data/${sectionId}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting ${sectionId} data:`, error);
      throw error;
    }
  }
};

// React hooks for data management
export const useConnectionsData = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        const data = await dataService.fetchData('connections');
        setConnections(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const addConnection = async (connectionData) => {
    try {
      const newConnection = await dataService.createData('connections', connectionData);
      setConnections(prev => [...prev, newConnection]);
      return newConnection;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateConnection = async (id, updateData) => {
    try {
      const updatedConnection = await dataService.updateData('connections', id, updateData);
      setConnections(prev => prev.map(conn => conn.id === id ? updatedConnection : conn));
      return updatedConnection;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteConnection = async (id) => {
    try {
      await dataService.deleteData('connections', id);
      setConnections(prev => prev.filter(conn => conn.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    connections,
    loading,
    error,
    addConnection,
    updateConnection,
    deleteConnection
  };
};

export const useTestimonialsData = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await dataService.fetchData('testimonials');
        setTestimonials(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const addTestimonial = async (testimonialData) => {
    try {
      const newTestimonial = await dataService.createData('testimonials', testimonialData);
      setTestimonials(prev => [...prev, newTestimonial]);
      return newTestimonial;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTestimonial = async (id, updateData) => {
    try {
      const updatedTestimonial = await dataService.updateData('testimonials', id, updateData);
      setTestimonials(prev => prev.map(test => test.id === id ? updatedTestimonial : test));
      return updatedTestimonial;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      await dataService.deleteData('testimonials', id);
      setTestimonials(prev => prev.filter(test => test.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    testimonials,
    loading,
    error,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  };
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
  dataService,
  useConnectionsData,
  useTestimonialsData,
  utils
};
