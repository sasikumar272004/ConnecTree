// components/BusinessOpportunityReceived.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaSearch, FaEdit } from 'react-icons/fa';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
  try {
    return localStorage?.getItem('token') || null;
  } catch (error) {
    console.warn('localStorage not available');
    return null;
  }
};

// Enhanced API Service for Business Opportunity Received
const businessOpportunityService = {
  fetchData: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/data/business-opportunity-received`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // ignore JSON parse error
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching business opportunity data:', error);
      throw error;
    }
  },

  fetchById: async (id) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/data/business-opportunity-received/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching business opportunity by ID:', error);
      throw error;
    }
  },

  updateData: async (id, data) => {
    try {
      const token = getAuthToken();

      console.log('=== UPDATE SERVICE DEBUG ===');
      console.log('Service updateData called with id:', id);
      console.log('ID type:', typeof id);
      console.log('ID length:', id ? id.length : 'null');
      console.log('Is MongoDB ObjectId format?', /^[0-9a-fA-F]{24}$/.test(id));
      console.log('Update data:', data);

      const apiUrl = `${API_BASE_URL}/data/business-opportunity-received/${id}`;
      console.log('Making request to:', apiUrl);

      // Clean the payload
      const updatePayload = { ...data };
      delete updatePayload.id;
      delete updatePayload._id;

      console.log('Cleaned payload:', updatePayload);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(updatePayload)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Update successful, result:', result);
      return result.data || result;
    } catch (error) {
      console.error('Error updating business opportunity data:', error);
      throw error;
    }
  },

  deleteData: async (id) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/data/business-opportunity-received/${id}`, {
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
      console.error('Error deleting business opportunity data:', error);
      throw error;
    }
  }
};

// Edit-only fields (fields that can be edited)
const editFields = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    placeholder: 'Select status',
    options: [
      { value: 'New', label: 'New' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Closed', label: 'Closed' }
    ]
  }
];

// Table columns configuration
const tableColumns = [
  { key: 'referralName', label: 'Referral Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value) => (
      <span className={`px-2 py-1 rounded text-xs ${
        value === 'Closed' ? ' text-white' :
        value === 'In Progress' ? ' text-white' :
        value === 'New' ? ' text-white' :
        ' text-gray-300'
      }`}>
        {value}
      </span>
    )
  },
  {
    key: 'businessClosed',
    label: 'Business Closed',
    sortable: true,
    render: (value, item) => (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => window.handleAddBusinessClosed && window.handleAddBusinessClosed(item)}
          className="bg-orange-500 text-white px-3 py-2 rounded text-xs hover:bg-orange-600 transition-colors"
        >
          Add Business Closed +
        </button>
      </div>
    )
  }
];

// Data Table Component
const DataTable = ({ 
  data, 
  onEdit, 
  onDelete,
  searchTerm,
  setSearchTerm,
  filterValues,
  setFilterValues
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and search logic
  const filteredData = data.filter(item => {
    const matchesSearch = searchTerm === '' || 
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true;
      return String(item[key] || '').toLowerCase().includes(String(value).toLowerCase());
    });
    
    return matchesSearch && matchesFilters;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (filterKey, value) => {
    setFilterValues(prev => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-950 py-6 px-10">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-slate-400 mb-2">
          Business &gt; Business Opportunity Received
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end justify-between mb-6 gap-4">
        <div className="flex items-end space-x-4">
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 mb-1">Start Date</label>
            <input
              type="date"
              className="bg-slate-800 border border-slate-700 rounded px-12 py-2 text-white text-sm h-10"
              value={filterValues.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 mb-1">End Date</label>
            <input
              type="date"
              className="bg-slate-800 border border-slate-700 rounded px-12 py-2 text-white text-sm h-10"
              value={filterValues.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-2 rounded transition-colors h-10">
            Search
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button className="bg-slate-950 border border-amber-600 hover:bg-slate-600 text-white px-12 py-2 rounded transition-colors">
            Export
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-12 py-2 rounded transition-colors">
            Print
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative rounded-2xl p-[2px] border-2 border-slate-100/80">
        <div className="flex items-center p-3 justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Show</span>
            <select
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-slate-400">entries</span>
          </div>

          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search opportunities..."
              className="bg-slate-800 border border-slate-700 rounded pl-10 pr-4 py-2 text-white text-sm w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="border border-slate-700 overflow-hidden bg-slate-900 rounded-2xl">
          <table className="w-full table-fixed">
            <thead className="bg-orange-500">
              <tr>
                {tableColumns.map((column, index) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-white font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap ${
                      index < tableColumns.length - 1 ? 'border-r border-orange-400' : ''
                    }`}
                  >
                    {column.label}
                    {column.sortable && <span className="ml-1 text-xs">↕</span>}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-white font-medium text-sm border-l border-orange-400">
                  Actions
                </th>
              </tr>
              
              {/* Column filters */}
              <tr className="bg-slate-900">
                {tableColumns.map((column, index) => (
                  <td
                    key={`filter-${column.key}`}
                    className={`px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap ${
                      index < tableColumns.length - 1 ? 'border-r border-slate-600' : ''
                    }`}
                  >
                    <input
                      type="text"
                      placeholder={`Search ${column.label}`}
                      className="h-10 w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-gray-200 text-xs"
                      value={filterValues[column.key] || ''}
                      onChange={(e) => handleFilterChange(column.key, e.target.value)}
                    />
                  </td>
                ))}
                <td className="px-4 py-2 border-l border-slate-600">
                  <input
                    type="text"
                    placeholder="Search Actions"
                    className="h-10 w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-gray-200 text-xs"
                    value={filterValues['actions'] || ''}
                    onChange={(e) => handleFilterChange('actions', e.target.value)}
                  />
                </td>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, rowIndex) => (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-700 transition-colors hover:bg-slate-700 ${
                      rowIndex % 2 === 0 ? 'bg-slate-800' : 'bg-slate-850'
                    }`}
                  >
                    {tableColumns.map((column, colIndex) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-gray-400 text-sm overflow-hidden text-ellipsis whitespace-nowrap ${
                          colIndex < tableColumns.length - 1 ? 'border-r border-slate-600' : ''
                        }`}
                      >
                        {column.render ? column.render(item[column.key], item) : item[column.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 border-l border-slate-600">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                          className="p-2 flex items-center space-x-2 text-white rounded transition-colors hover:bg-slate-600"
                          title="Edit"
                        >
                          <span>Edit</span>
                          <FaEdit className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableColumns.length + 1} className="px-4 py-8 text-center text-slate-400">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => Math.abs(page - currentPage) <= 2)
              .map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === page
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  {page}
                </button>
              ))
            }
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Form Component - FIXED VERSION
const DataForm = ({ 
  itemId,
  onSubmit, 
  onCancel, 
  isEdit = false 
}) => {
  const [initialData, setInitialData] = useState({});
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const currentFields = isEdit ? editFields : [];

  // Load data when component mounts or itemId changes
  useEffect(() => {
    const loadItemData = async () => {
      console.log('loadItemData called with itemId:', itemId, 'isEdit:', isEdit);
      
      if (itemId && isEdit) {
        try {
          setIsLoadingData(true);
          setLoadError(null);
          
          // First try to get data from sessionStorage (selected row data)
          try {
            const storedItem = sessionStorage.getItem('editingItem');
            if (storedItem) {
              const item = JSON.parse(storedItem);
              console.log('Stored item from sessionStorage:', item);
              
              // Check if this is the right item (compare both _id and id)
              const itemMatches = (item._id && item._id.toString() === itemId.toString()) || 
                                 (item.id && item.id.toString() === itemId.toString());
              
              console.log('Item match check:', {
                storedId: item.id,
                storedMongoId: item._id,
                expectedId: itemId,
                matches: itemMatches
              });
              
              if (itemMatches) {
                console.log('Using selected row data from sessionStorage');
                setInitialData(item);
                setFormData(item);
                setIsLoadingData(false);
                return;
              } else {
                console.log('Stored item ID mismatch. Expected:', itemId, 'Got ID:', item.id, 'Got _id:', item._id);
              }
            } else {
              console.log('No stored item found in sessionStorage');
            }
          } catch (storageError) {
            console.warn('Cannot access sessionStorage:', storageError);
          }
          
          // If no sessionStorage data, try to fetch from API
          console.log('Fetching data from API for item:', itemId);
          const data = await businessOpportunityService.fetchById(itemId);
          setInitialData(data);
          setFormData(data);
        } catch (error) {
          console.error('Error loading item data:', error);
          setLoadError('Failed to load item data. Please try again.');
        } finally {
          setIsLoadingData(false);
        }
      } else {
        console.log('Skipping data load - no itemId or not in edit mode');
        setIsLoadingData(false);
      }
    };

    loadItemData();
  }, [itemId, isEdit]);

  const handleFieldChange = (fieldKey, value) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
    if (errors[fieldKey]) {
      setErrors(prev => ({ ...prev, [fieldKey]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    currentFields.forEach(field => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
        // Don't show alert here since parent component handles user messaging
        // Just log the error for debugging
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderField = (field) => {
    const commonProps = {
      className: `w-full bg-slate-800 border rounded px-3 py-2 text-white ${
        errors[field.key] ? 'border-red-500' : 'border-slate-700'
      }`,
      value: formData[field.key] || '',
      onChange: (e) => handleFieldChange(field.key, e.target.value),
      placeholder: field.placeholder,
      disabled: isLoading
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  // Function to format the display value
  const formatDisplayValue = (value) => {
    if (!value) return 'N/A';
    return value;
  };

  if (isLoadingData) {
    return (
      <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading item data...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-red-500 mb-4 flex justify-center">
            ⚠️
          </div>
          <h2 className="text-2xl font-semibold text-red-500 mb-2">
            Error Loading Item
          </h2>
          <p className="text-slate-400 mb-4">
            {loadError}
          </p>
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 p-6">
      <div className="mb-6">
        <div className="text-sm text-slate-400 mb-2">
          Business &gt; Edit Business Opportunity Received
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Combined container for both read-only data and form */}
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
          {/* Display read-only data when editing */}
          {isEdit && initialData && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-300 mb-4">
                Opportunity Details
              </h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-slate-400 font-medium w-48">Date:</span>
                  <span className="text-white">{formatDisplayValue(initialData.date)}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-400 font-medium w-48">Referral Name:</span>
                  <span className="text-white">{formatDisplayValue(initialData.referralName)}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-400 font-medium w-48">Referral Phone:</span>
                  <span className="text-white">{formatDisplayValue(initialData.phone)}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-400 font-medium w-48">Referral Email:</span>
                  <span className="text-white">{formatDisplayValue(initialData.email)}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-400 font-medium w-48">Referred By:</span>
                  <span className="text-white">{formatDisplayValue(initialData.referredBy)}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-400 font-medium w-48">Current Status:</span>
                  <span className="text-white">{formatDisplayValue(initialData.status)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form - Only show when editing */}
          {isEdit && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                    {errors[field.key] && (
                      <p className="mt-1 text-sm text-red-500">{errors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Business Opportunity Received Component - FIXED VERSION
const BusinessOpportunityReceived = () => {
  const navigate = useNavigate();
  const { tab, section, view } = useParams(); // Get all params from Home component
  const location = useLocation();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});

  const debugDataStructure = () => {
    console.log('=== DATA STRUCTURE DEBUG ===');
    if (data.length > 0) {
      console.log('Sample data item:', data[0]);
      console.log('Keys in first item:', Object.keys(data[0] || {}));
      console.log('Has _id?', !!data[0]?._id);
      console.log('Has id?', !!data[0]?.id);
      console.log('_id value:', data[0]?._id);
      console.log('id value:', data[0]?.id);
    } else {
      console.log('No data available for debugging');
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await businessOpportunityService.fetchData();
      setData(result);
      debugDataStructure(); // Debug data structure after loading
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    console.log('=== HANDLE EDIT DEBUG ===');
    console.log('Edit clicked for item:', item);
    console.log('Complete item object:', JSON.stringify(item, null, 2));
    console.log('Item _id:', item._id);
    console.log('Item id:', item.id);
    console.log('Current location:', location.pathname);

    try {
      // Store the selected row data for the form
      try {
        sessionStorage.setItem('editingItem', JSON.stringify(item));
        console.log('Selected row data stored in sessionStorage');
      } catch (e) {
        console.warn('Cannot use sessionStorage:', e);
      }

      // CRITICAL: Always use MongoDB _id - this is the fix!
      const itemId = item._id;
      console.log('Using MongoDB _id for navigation:', itemId);
      console.log('ItemId type:', typeof itemId);

      if (!itemId) {
        console.error('No _id found in item:', item);
        throw new Error('No _id found in item object');
      }

      // Navigate using MongoDB _id
      const editPath = `/home/business/business-opportunity-received/edit-${itemId}`;
      console.log('Navigating to:', editPath);
      navigate(editPath);
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Unable to navigate to edit form: ' + error.message);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Extract ID from view parameter
      let itemId = null;
      
      if (view && view.startsWith('edit-')) {
        itemId = view.replace('edit-', '');
        console.log('Extracted itemId from view param:', itemId);
      }
      
      if (itemId) {
        console.log('Updating item:', itemId, 'with form data:', formData);
        
        // Get the original item data
        let originalData = null;
        try {
          const storedItem = sessionStorage.getItem('editingItem');
          if (storedItem) {
            originalData = JSON.parse(storedItem);
            console.log('Original item data:', originalData);
          }
        } catch (e) {
          console.warn('Cannot access sessionStorage:', e);
        }
        
        // Only send the fields that can be updated
        const updatePayload = {};
        editFields.forEach(field => {
          if (formData[field.key] !== undefined) {
            updatePayload[field.key] = formData[field.key];
          }
        });
        
        console.log('Final itemId for update:', itemId);
        console.log('Update payload (only editable fields):', updatePayload);
        
        // FIXED: Use the MongoDB _id for the API call
        const updatedItem = await businessOpportunityService.updateData(itemId, updatePayload);
        
        // Merge the updated fields with original data for local state update
        const mergedItem = originalData ? { ...originalData, ...updatedItem } : updatedItem;
        
        // Update the data in the local state using the MongoDB _id
        setData(prev => prev.map(item => {
          // FIXED: Match by MongoDB _id
          const itemMatches = item._id === itemId;
          return itemMatches ? mergedItem : item;
        }));
        
        console.log('Item updated successfully, merged result:', mergedItem);
        
        // Clear sessionStorage
        try {
          sessionStorage.removeItem('editingItem');
        } catch (e) {
          console.warn('Cannot clear sessionStorage:', e);
        }
        
        // Navigate back to the main table view
        navigate('/home/business/business-opportunity-received');
      } else {
        throw new Error('No item ID found for update');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to update the item. ';
      if (error.message.includes('500')) {
        errorMessage += 'There was a server error. Please check with your administrator.';
      } else if (error.message.includes('404')) {
        errorMessage += 'The item was not found on the server.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage += 'You do not have permission to update this item.';
      } else if (error.message.includes('Cast to ObjectId')) {
        errorMessage += 'There was an ID format issue. Please contact support.';
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
      throw error; // Let the form component handle the error
    }
  };

  const handleFormCancel = () => {
    // Clear sessionStorage when canceling
    try {
      sessionStorage.removeItem('editingItem');
    } catch (e) {
      console.warn('Cannot clear sessionStorage:', e);
    }
    navigate('/home/business/business-opportunity-received');
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await businessOpportunityService.deleteData(item.id);
        setData(prev => prev.filter(i => i.id !== item.id));
        console.log('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Business Opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-950 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-red-500 mb-4 flex justify-center">
            ⚠️
          </div>
          <h2 className="text-2xl font-semibold text-red-500 mb-2">
            Error Loading Data
          </h2>
          <p className="text-slate-400 mb-4">
            {error}
          </p>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show form view for editing
  if (view && view.startsWith('edit-')) {
    const itemId = view.replace('edit-', '');
    console.log('Rendering form for itemId:', itemId);
    return (
      <DataForm
        itemId={itemId}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isEdit={true}
      />
    );
  }

  // Alternative check using sessionStorage as fallback
  if (view === 'form') {
    try {
      const storedItem = sessionStorage.getItem('editingItem');
      if (storedItem) {
        const item = JSON.parse(storedItem);
        return (
          <DataForm
            itemId={item.id || item._id}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isEdit={true}
          />
        );
      }
    } catch (e) {
      console.warn('Cannot access sessionStorage:', e);
    }
  }

  // Show table view
  return (
    <DataTable
      data={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filterValues={filterValues}
      setFilterValues={setFilterValues}
    />
  );
};

export default BusinessOpportunityReceived