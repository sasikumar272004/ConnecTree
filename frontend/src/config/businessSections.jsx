// config/businessSections.js
import React, { useState, useEffect } from 'react';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API service functions
export const businessDataService = {
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

// React hooks for business data management
export const useBusinessData = (sectionId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionData = await businessDataService.fetchData(sectionId);
        setData(sectionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sectionId) {
      fetchData();
    }
  }, [sectionId]);

  const addItem = async (itemData) => {
    try {
      const newItem = await businessDataService.createData(sectionId, itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = await businessDataService.updateData(sectionId, id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await businessDataService.deleteData(sectionId, id);
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

  const saveEdit = async (formData) => {
    if (!editingId) return;

    try {
      await updateItem(editingId, formData);
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
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
    saveEdit,
    cancelEdit
  };
};

export const businessSections = {
  'p2p': {
    title: 'P2P',
    tableConfig: {
      columns: [
        { key: 'date', label: 'Date', sortable: true },
        { key: 'meetWith', label: 'Meet With', sortable: true },
        { key: 'initiatedBy', label: 'Initiated By', sortable: true },
        { key: 'location', label: 'Location', sortable: false },
        { key: 'topics', label: 'Topics', sortable: false },
        { 
          key: 'status', 
          label: 'Status', 
          sortable: true,
          render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
              value === 'Completed' ? ' text-gray-300' : 
              value === 'Scheduled' ? ' text-gray-300' : 
              ' text-gray-300'
            }`}>
              {value}
            </span>
          )
        }
      ],
      filters: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ],
      addButtonText: 'Add P2P',
      searchPlaceholder: 'Search meetings...',
      showActions: false
    },
    formConfig: {
      title: 'Add P2P Meeting',
      fields: [
        {
          key: 'meetWith',
          label: 'Meet with',
          type: 'select',
          required: true,
          placeholder: 'Select a member',
          options: [
            { value: 'david', label: 'David Smith' },
            { value: 'phillips', label: 'Phillips Johnson' },
            { value: 'mike', label: 'Mike Williams' }
          ]
        },
        {
          key: 'invitedBy',
          label: 'Invited By',
          type: 'select',
          required: true,
          placeholder: 'Select a member',
          options: [
            { value: 'self', label: 'Myself' },
            { value: 'david', label: 'David Smith' },
            { value: 'phillips', label: 'Phillips Johnson' }
          ]
        },
        {
          key: 'location',
          label: 'Location',
          type: 'text',
          required: false,
          placeholder: 'Enter location'
        },
        {
          key: 'topics',
          label: 'Topic',
          type: 'textarea',
          required: true,
          placeholder: 'Enter topic discussion',
          rows: 3
        },
        {
          key: 'date',
          label: 'Date',
          type: 'date',
          required: true
        }
      ],
      submitText: 'Submit',
      cancelText: 'Cancel'
    },

  },

 

  'business-opportunity-given': {
    title: 'Business Opportunity Given',
    tableConfig: {
      columns: [
        { key: 'date', label: 'Date', sortable: true },
        { key: 'to', label: 'To', sortable: true },
        { key: 'referral', label: 'Referral', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { 
          key: 'referralStatus', 
          label: 'Referral Status', 
          sortable: true,
          render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
              value === 'Completed' ? ' text-gray-400' : 
              value === 'In Progress' ? ' text-gray-400' : 
              value === 'Pending' ? ' text-gray-400' :
              'bg-gray-600 text-gray-300'
            }`}>
              {value}
            </span>
          )
        },
        { key: 'comments', label: 'Comments', sortable: false },
        { 
          key: 'status', 
          label: 'Status', 
          sortable: true,
          render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
              value === 'Active' ? ' text-gray-300' : 
              value === 'Inactive' ? ' text-gray-300' : 
              'bg-gray-600 text-gray-300'
            }`}>
              {value}
            </span>
          )
        }
      ],
      filters: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ],
      addButtonText: 'Give Opportunity',
      searchPlaceholder: 'Search given opportunities...',
      showActions: false
    },
    formConfig: {
      title: 'Give Business Opportunity',
      fields: [
        {
          key: 'to',
          label: 'Referrals To',
          type: 'select',
          required: true,
          placeholder: 'Select a member',
          options: [
            { value: 'david', label: 'David Smith' },
            { value: 'phillips', label: 'Phillips Johnson' },
            { value: 'mike', label: 'Mike Williams' }
          ]
        },
        {
          key: 'referral',
          label: 'Referrals',
          type: 'text',
          required: true,
          placeholder: 'Enter your answer'
        },
        {
          key: 'type',
          label: 'Referrals Type',
          type: 'select',
          required: true,
          placeholder: 'Select Referral Type',
          options: [
            { value: 'direct', label: 'Direct' },
            { value: 'indirect', label: 'Indirect' },
            { value: 'consultation', label: 'Consultation' }
          ]
        },
        {
          key: 'referralStatus',
          label: 'Referral Status',
          type: 'select',
          required: true,
          placeholder: 'Select Referral Status',
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' }
          ]
        },
        {
          key: 'address',
          label: 'Address',
          type: 'text',
          required: false,
          placeholder: 'Enter location'
        },
        {
          key: 'phone',
          label: 'Phone',
          type: 'text',
          required: true,
          placeholder: 'Enter phone'
        },
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          required: false,
          placeholder: 'Enter email'
        },
        {
          key: 'comments',
          label: 'Comments',
          type: 'textarea',
          required: false,
          placeholder: 'Enter comments',
          rows: 3
        }
      ],
      submitText: 'Submit',
      cancelText: 'Cancel'
    },

  },

  'business-closed': {
    title: 'Business Closed',
    tableConfig: {
      columns: [
        { key: 'date', label: 'Date', sortable: true },
        { key: 'to', label: 'To', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true },
        { key: 'businessType', label: 'Business Type', sortable: true },
        { key: 'referralType', label: 'Referral Type', sortable: true },
        { key: 'comments', label: 'Comments', sortable: false },
        { key: 'status', label: 'Status', sortable: true }
      ],
      filters: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ],
      addButtonText: 'Add Business Closed',
      searchPlaceholder: 'Search closed business...',
      showActions: false
    },
    formConfig: {
      title: 'Add Business Closed',
      fields: [
        {
          key: 'to',
          label: 'Referrals To',
          type: 'select',
          required: true,
          placeholder: 'Select a member',
          options: [
            { value: 'david', label: 'David Smith' },
            { value: 'phillips', label: 'Phillips Johnson' },
            { value: 'mike', label: 'Mike Williams' }
          ]
        },
        {
          key: 'amount',
          label: 'Amount',
          type: 'number',
          required: true,
          placeholder: 'Enter closed business amount'
        },
        {
          key: 'businessType',
          label: 'Business Type',
          type: 'select',
          required: true,
          placeholder: 'Select Business Type',
          options: [
            { value: 'consulting', label: 'Consulting' },
            { value: 'software', label: 'Software Development' },
            { value: 'marketing', label: 'Marketing Services' },
            { value: 'sales', label: 'Sales' },
            { value: 'real-estate', label: 'Real Estate' },
            { value: 'finance', label: 'Finance' }
          ]
        },
        {
          key: 'referralType',
          label: 'Referral Type',
          type: 'select',
          required: true,
          placeholder: 'Select Referral Type',
          options: [
            { value: 'direct', label: 'Direct Referral' },
            { value: 'indirect', label: 'Indirect Referral' },
            { value: 'self-generated', label: 'Self Generated' }
          ]
        },
        {
          key: 'comments',
          label: 'Comments',
          type: 'textarea',
          required: false,
          placeholder: 'Enter comments',
          rows: 3
        }
      ],
      submitText: 'Submit',
      cancelText: 'Cancel'
    },

  },

  'meetings': {
    title: 'Meetings',
    tableConfig: {
      columns: [
        { key: 'meetingDate', label: 'Meeting Date', sortable: true },
        { key: 'enteredBy', label: 'Entered by', sortable: true },
        { key: 'enteredDate', label: 'Entered date', sortable: true },
        { 
          key: 'status', 
          label: 'Status', 
          sortable: true,
          render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
              value === 'Completed' ? ' text-gray-300' : 
              value === 'Scheduled' ? ' text-gray-300' : 
              value === 'Cancelled' ? ' text-gray-300' :
              ' text-gray-300'
            }`}>
              {value}
            </span>
          )
        }
      ],
      filters: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ],
      searchPlaceholder: 'Search meetings...',
      showActions: false,
      showExportPrint: false,
      showAddButton: false,
      clickableRows: true
    },
    detailsConfig: {
      title: 'Meeting Details',
      columns: [
        { key: 'firstName', label: 'First Name', sortable: true },
        { key: 'lastName', label: 'Last Name', sortable: true },
        { key: 'palms', label: 'PALMS', sortable: true },
        { key: 'rgi', label: 'RGI', sortable: true },
        { key: 'rgo', label: 'RGO', sortable: true },
        { key: 'pri', label: 'PRI', sortable: true },
        { key: 'rro', label: 'RRO', sortable: true },
        { key: 'visitors', label: 'Visitors', sortable: true },
        { key: 'oneToOne', label: '121', sortable: true },
        { key: 'tqGiven', label: 'TQ Given', sortable: true },
        { key: 'testimonials', label: 'Testimonials', sortable: true }
      ],
      filters: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ],
      searchPlaceholder: 'Search meeting details...',
      showActions: false,
      showExportPrint: false,
      showAddButton: false
    },
   
  },

  'connections': {
  title: 'Connections'
},

'testimonials': {
  title: 'Testimonials'
},

  'upcoming-events': {
    title: 'Upcoming Events',
    tableConfig: {
      columns: [
        { key: 'eventName', label: 'Event Name', sortable: true },
        { key: 'startDateTime', label: 'Start Date/Time', sortable: true },
        { key: 'location', label: 'Location', sortable: true }
      ],
      filters: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ],
      searchPlaceholder: 'Search events...',
      showActions: false,
      showExportPrint: false,
      showAddButton: false
    },

  },

  'visitors': {
    title: 'Visitors',
    tableConfig: {
      columns: [
        { key: 'visitorName', label: 'Visitor Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone', sortable: true },
        { key: 'visitDate', label: 'Visit Date', sortable: true },
        { key: 'companyName', label: 'Company Name', sortable: true }
      ],
      filters: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ],
      addButtonText: 'Add Visitor',
      searchPlaceholder: 'Search visitors...',
      showActions: true,
      showExportPrint: false
    },
    formConfig: {
      title: 'Register Someone Else (To Visit My Chapter)',
      fields: [
        {
          key: 'registrationType',
          label: 'Registrations Type',
          type: 'select',
          required: true,
          placeholder: 'Select type',
          options: [
            { value: 'visitor', label: 'Visitor' },
            { value: 'guest', label: 'Guest' },
            { value: 'member', label: 'Member' }
          ]
        },
        {
          key: 'registrationChapter',
          label: 'Registrations Chapter',
          type: 'select',
          required: true,
          placeholder: 'Select Chapter',
          options: [
            { value: 'ekam-iconic', label: 'EKAM Iconic' },
            { value: 'ekam-elite', label: 'EKAM Elite' },
            { value: 'ekam-prime', label: 'EKAM Prime' }
          ]
        },
        {
          key: 'visitDate',
          label: 'Visit Date',
          type: 'date',
          required: true,
          value: '2025-09-24'
        },
        {
          key: 'firstName',
          label: 'First name',
          type: 'text',
          required: true,
          placeholder: 'Enter your first name'
        },
        {
          key: 'lastName',
          label: 'Last name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          key: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          placeholder: 'Select category',
          options: [
            { value: 'advertising-agency', label: 'Advertising Agency' },
            { value: 'consulting', label: 'Consulting' },
            { value: 'technology', label: 'Technology' },
            { value: 'finance', label: 'Finance' }
          ]
        },
        {
          key: 'phone',
          label: 'Phone number',
          type: 'text',
          required: true,
          placeholder: 'Enter Phone number'
        },
        {
          key: 'email',
          label: 'Email address',
          type: 'email',
          required: true,
          placeholder: 'Enter your email address'
        },
        {
          key: 'companyName',
          label: 'Company Name',
          type: 'text',
          required: true,
          placeholder: 'Enter company name'
        },
        {
          key: 'streetAddress',
          label: 'Street Address',
          type: 'text',
          required: true,
          placeholder: 'Enter Street Address'
        },
        {
          key: 'city',
          label: 'City',
          type: 'text',
          required: true,
          placeholder: 'Enter City'
        },
        {
          key: 'state',
          label: 'State',
          type: 'text',
          required: true,
          placeholder: 'Enter State'
        },
        {
          key: 'pincode',
          label: 'Pincode',
          type: 'text',
          required: true,
          placeholder: 'Enter pincode'
        },
        {
          key: 'country',
          label: 'Country',
          type: 'text',
          required: true,
          placeholder: 'Enter Country'
        }
      ],
      editFields: [
        {
          key: 'registrationType',
          label: 'Registrations Type',
          type: 'select',
          required: true,
          placeholder: 'Select type',
          options: [
            { value: 'visitor', label: 'Visitor' },
            { value: 'guest', label: 'Guest' },
            { value: 'member', label: 'Member' }
          ]
        },
        {
          key: 'registrationChapter',
          label: 'Registrations Chapter',
          type: 'select',
          required: true,
          placeholder: 'Select Chapter',
          options: [
            { value: 'ekam-iconic', label: 'EKAM Iconic' },
            { value: 'ekam-elite', label: 'EKAM Elite' },
            { value: 'ekam-prime', label: 'EKAM Prime' }
          ]
        },
        {
          key: 'visitDate',
          label: 'Visit Date',
          type: 'date',
          required: true
        },
        {
          key: 'firstName',
          label: 'First name',
          type: 'text',
          required: true,
          placeholder: 'David'
        },
        {
          key: 'lastName',
          label: 'Last name',
          type: 'text',
          required: true,
          placeholder: 'Jhon'
        },
        {
          key: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          placeholder: 'Advertising Agency',
          options: [
            { value: 'advertising-agency', label: 'Advertising Agency' },
            { value: 'consulting', label: 'Consulting' },
            { value: 'technology', label: 'Technology' },
            { value: 'finance', label: 'Finance' }
          ]
        },
        {
          key: 'phone',
          label: 'Phone number',
          type: 'text',
          required: true,
          placeholder: '9988776655'
        },
        {
          key: 'email',
          label: 'Email address',
          type: 'email',
          required: true,
          placeholder: 'david66@gmail.com'
        },
        {
          key: 'companyName',
          label: 'Company Name',
          type: 'text',
          required: true,
          placeholder: 'NC Limited'
        },
        {
          key: 'streetAddress',
          label: 'Street Address',
          type: 'text',
          required: true,
          placeholder: '1266, KPHB Phase 1'
        },
        {
          key: 'city',
          label: 'City',
          type: 'text',
          required: true,
          placeholder: 'Hyderabad'
        },
        {
          key: 'state',
          label: 'State',
          type: 'text',
          required: true,
          placeholder: 'Telangana'
        },
        {
          key: 'pincode',
          label: 'Pincode',
          type: 'text',
          required: true,
          placeholder: '500072'
        },
        {
          key: 'country',
          label: 'Country',
          type: 'text',
          required: true,
          placeholder: 'India'
        }
      ],
      submitText: 'Submit',
      cancelText: 'Cancel'
    },

  },

  'my-feeds': {
    title: 'My Feeds',
    tableConfig: {
      columns: [
        { key: 'title', label: 'Title', sortable: true },
        { key: 'content', label: 'Content', sortable: false },
        { key: 'author', label: 'Author', sortable: true },
        { key: 'publishDate', label: 'Publish Date', sortable: true },
        { key: 'category', label: 'Category', sortable: true },
        { 
          key: 'status', 
          label: 'Status', 
          sortable: true,
          render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
              value === 'Published' ? ' text-gray-300' : 
              value === 'Draft' ? ' text-gray-300' : 
              'bg-gray-600 text-gray-300'
            }`}>
              {value}
            </span>
          )
        }
      ],
      filters: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ],
      addButtonText: 'Add Feed',
      searchPlaceholder: 'Search feeds...'
    },
    formConfig: {
      title: 'Add Feed',
      fields: [
        {
          key: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          placeholder: 'Enter feed title'
        },
        {
          key: 'content',
          label: 'Content',
          type: 'textarea',
          required: true,
          placeholder: 'Enter feed content',
          rows: 4
        },
        {
          key: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          placeholder: 'Select category',
          options: [
            { value: 'business', label: 'Business' },
            { value: 'networking', label: 'Networking' },
            { value: 'events', label: 'Events' },
            { value: 'announcements', label: 'Announcements' }
          ]
        },
        {
          key: 'publishDate',
          label: 'Publish Date',
          type: 'date',
          required: true
        }
      ],
      submitText: 'Submit',
      cancelText: 'Cancel'
    },

  },

  'one-to-many': {
    title: 'One to Many',
    tableConfig: {
      columns: [
        { key: 'meetingDate', label: 'Meeting Date', sortable: true },
        { key: 'enteredBy', label: 'Entered by', sortable: true },
        { key: 'enteredDate', label: 'Entered date', sortable: true },
        { 
          key: 'status', 
          label: 'Status', 
          sortable: true,
          render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
              value === 'Completed' ? ' text-gray-300' : 
              value === 'Scheduled' ? ' text-gray-300' : 
              value === 'Cancelled' ? ' text-gray-300' :
              'bg-yellow-600 text-gray-300'
            }`}>
              {value}
            </span>
          )
        }
      ],
      filters: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ],
      searchPlaceholder: 'Search one to many meetings...',
      showActions: false,
      showExportPrint: false,
      showAddButton: false
    },

  }
};

// Business Section Manager Class
export class BusinessSectionManager {
  static getSectionConfig(sectionId) {
    return businessSections[sectionId] || null;
  }

  static getAllSections() {
    return Object.keys(businessSections);
  }

  static getSectionData(sectionId) {
    const config = this.getSectionConfig(sectionId);
    return config ? config.data : [];
  }

  static updateSectionData(sectionId, newData) {
    if (businessSections[sectionId]) {
      businessSections[sectionId].data = newData;
    }
  }

  static addItemToSection(sectionId, newItem) {
    if (businessSections[sectionId]) {
      const newId = Math.max(...businessSections[sectionId].data.map(item => item.id || 0), 0) + 1;
      const processedItem = { ...newItem, id: newId };
      
      // For visitors, combine firstName and lastName into visitorName
      if (sectionId === 'visitors' && newItem.firstName && newItem.lastName) {
        processedItem.visitorName = `${newItem.firstName} ${newItem.lastName}`;
      }
      
      businessSections[sectionId].data.push(processedItem);
    }
  }
}