// BusinessData.jsx
// This file contains all the data and business logic for business sections
import React, { useState, useEffect } from 'react';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token - FIXED for Claude.ai compatibility
const getAuthToken = () => {
  // For Claude.ai artifacts, we'll use a fallback token or make it optional
  try {
    return localStorage?.getItem('token') || null;
  } catch (error) {
    console.warn('localStorage not available, proceeding without token');
    return null;
  }
};

// API service functions
export const businessDataService = {
  // Generic function to fetch data from API
  fetchData: async (sectionId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/data/${sectionId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
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
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
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
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
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
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
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

// Enhanced React hooks with edit state management
export const useP2PData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionData = await businessDataService.fetchData('p2p');
        setData(sectionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = async (itemData) => {
    try {
      const newItem = await businessDataService.createData('p2p', itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = await businessDataService.updateData('p2p', id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      setEditingId(null);
      setEditForm({});
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await businessDataService.deleteData('p2p', id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Edit functionality
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (formData = null) => {
    if (editingId) {
      // Use provided formData or fallback to editForm state
      const dataToUpdate = formData || editForm;
      await updateItem(editingId, dataToUpdate);
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    data,
    loading,
    error,
    editingId,
    editForm,
    addItem,
    updateItem,
    deleteItem,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditForm
  };
};

export const useBusinessOpportunitiesReceivedData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionData = await businessDataService.fetchData('business-opportunity-received');
        setData(sectionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = async (itemData) => {
    try {
      const newItem = await businessDataService.createData('business-opportunity-received', itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = await businessDataService.updateData('business-opportunity-received', id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      setEditingId(null);
      setEditForm({});
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await businessDataService.deleteData('business-opportunity-received', id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (formData = null) => {
    if (editingId) {
      // Use provided formData or fallback to editForm state
      const dataToUpdate = formData || editForm;
      await updateItem(editingId, dataToUpdate);
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    data,
    loading,
    error,
    editingId,
    editForm,
    addItem,
    updateItem,
    deleteItem,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditForm
  };
};

export const useBusinessOpportunitiesGivenData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionData = await businessDataService.fetchData('business-opportunity-given');
        setData(sectionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = async (itemData) => {
    try {
      const newItem = await businessDataService.createData('business-opportunity-given', itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = await businessDataService.updateData('business-opportunity-given', id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      setEditingId(null);
      setEditForm({});
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await businessDataService.deleteData('business-opportunity-given', id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (formData = null) => {
    if (editingId) {
      // Use provided formData or fallback to editForm state
      const dataToUpdate = formData || editForm;
      await updateItem(editingId, dataToUpdate);
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    data,
    loading,
    error,
    editingId,
    editForm,
    addItem,
    updateItem,
    deleteItem,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditForm
  };
};

export const useBusinessClosedData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionData = await businessDataService.fetchData('business-closed');
        setData(sectionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = async (itemData) => {
    try {
      const newItem = await businessDataService.createData('business-closed', itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = await businessDataService.updateData('business-closed', id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      setEditingId(null);
      setEditForm({});
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await businessDataService.deleteData('business-closed', id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (formData = null) => {
    if (editingId) {
      // Use provided formData or fallback to editForm state
      const dataToUpdate = formData || editForm;
      await updateItem(editingId, dataToUpdate);
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    data,
    loading,
    error,
    editingId,
    editForm,
    addItem,
    updateItem,
    deleteItem,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditForm
  };
};

export const useMeetingsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionData = await businessDataService.fetchData('meetings');
        setData(sectionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = async (itemData) => {
    try {
      const newItem = await businessDataService.createData('meetings', itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = await businessDataService.updateData('meetings', id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      setEditingId(null);
      setEditForm({});
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await businessDataService.deleteData('meetings', id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (formData = null) => {
    if (editingId) {
      // Use provided formData or fallback to editForm state
      const dataToUpdate = formData || editForm;
      await updateItem(editingId, dataToUpdate);
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    data,
    loading,
    error,
    editingId,
    editForm,
    addItem,
    updateItem,
    deleteItem,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditForm
  };
};

export const useVisitorsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionData = await businessDataService.fetchData('visitors');
        setData(sectionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = async (itemData) => {
    try {
      const newItem = await businessDataService.createData('visitors', itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = await businessDataService.updateData('visitors', id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      setEditingId(null);
      setEditForm({});
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await businessDataService.deleteData('visitors', id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (formData = null) => {
    if (editingId) {
      // Use provided formData or fallback to editForm state
      const dataToUpdate = formData || editForm;
      await updateItem(editingId, dataToUpdate);
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    data,
    loading,
    error,
    editingId,
    editForm,
    addItem,
    updateItem,
    deleteItem,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditForm
  };
};

export const useMyFeedsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionData = await businessDataService.fetchData('my-feeds');
        setData(sectionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = async (itemData) => {
    try {
      const newItem = await businessDataService.createData('my-feeds', itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = await businessDataService.updateData('my-feeds', id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      setEditingId(null);
      setEditForm({});
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await businessDataService.deleteData('my-feeds', id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (editingId && editForm) {
      await updateItem(editingId, editForm);
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    data,
    loading,
    error,
    editingId,
    editForm,
    addItem,
    updateItem,
    deleteItem,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditForm
  };
};

export const useOneToManyData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionData = await businessDataService.fetchData('one-to-many');
        setData(sectionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = async (itemData) => {
    try {
      const newItem = await businessDataService.createData('one-to-many', itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = await businessDataService.updateData('one-to-many', id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      setEditingId(null);
      setEditForm({});
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await businessDataService.deleteData('one-to-many', id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (editingId && editForm) {
      await updateItem(editingId, editForm);
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    data,
    loading,
    error,
    editingId,
    editForm,
    addItem,
    updateItem,
    deleteItem,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditForm
  };
};

export const useUpcomingEventsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionData = await businessDataService.fetchData('upcoming-events');
        setData(sectionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = async (itemData) => {
    try {
      const newItem = await businessDataService.createData('upcoming-events', itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = await businessDataService.updateData('upcoming-events', id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      setEditingId(null);
      setEditForm({});
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await businessDataService.deleteData('upcoming-events', id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (editingId && editForm) {
      await updateItem(editingId, editForm);
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    data,
    loading,
    error,
    editingId,
    editForm,
    addItem,
    updateItem,
    deleteItem,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditForm
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
    if (!text) return '';
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
  businessDataService,
  useP2PData,
  useBusinessOpportunitiesReceivedData,
  useBusinessOpportunitiesGivenData,
  useBusinessClosedData,
  useMeetingsData,
  useVisitorsData,
  useMyFeedsData,
  useOneToManyData,
  useUpcomingEventsData,
  utils
};