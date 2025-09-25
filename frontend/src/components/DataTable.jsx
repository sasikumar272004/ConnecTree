// components/DataTable.js
import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaEye, FaTrash, FaArrowLeft } from 'react-icons/fa';

const DataTable = ({ 
  title, 
  data = [], 
  columns = [], 
  onAdd, 
  onEdit, 
  onView, 
  onDelete,
  onRowClick,
  filters = [],
  showActions = true,
  showExportPrint = true,
  showAddButton = true,
  addButtonText = "Add",
  searchPlaceholder = "Search...",
  clickableRows = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: '', data: [], columns: [] });

  const handleRowClick = (item) => {
    if (clickableRows && onRowClick) {
      onRowClick(item);
    } else if (clickableRows && item.details) {
      // Handle meetings section specifically
      setModalData({
        title: `Meeting Details - ${item.meetingDate}`,
        data: item.details,
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
        meetingInfo: {
          meetingDate: item.meetingDate,
          enteredBy: item.enteredBy,
          enteredDate: item.enteredDate,
          status: item.status
        }
      });
      setShowModal(true);
    }
  };

  // Handle edit action
  const handleEdit = (item, e) => {
    e.stopPropagation(); // Prevent row click event
    if (onEdit) {
      onEdit(item);
    }
  };

  // Handle view action
  const handleView = (item, e) => {
    e.stopPropagation(); // Prevent row click event
    if (onView) {
      onView(item);
    }
  };

  // Handle delete action
  const handleDelete = (item, e) => {
    e.stopPropagation(); // Prevent row click event
    if (onDelete) {
      onDelete(item);
    }
  };

  // Enhanced filter and search logic
  const filteredData = data.filter(item => {
    // Global search
    const matchesSearch = searchTerm === '' || 
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Column-specific filters
    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true; // No filter applied for this column
      
      // For Actions column, search in action buttons or any action-related text
      if (key === 'actions') {
        // You can customize what to search in actions column
        const actionTexts = ['Edit', 'View', 'Delete'].join(' ').toLowerCase();
        return actionTexts.includes(value.toLowerCase());
      }
      
      // For regular columns
      return String(item[key] || '').toLowerCase().includes(String(value).toLowerCase());
    });
    
    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (filterKey, value) => {
    setFilterValues(prev => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // If modal is shown, render full-screen modal instead of table
  if (showModal) {
    return (
      <FullScreenModal 
        modalData={modalData} 
        onClose={() => setShowModal(false)} 
      />
    );
  }

  return (
    <div className="bg-slate-950 py-6 px-10">
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <div className="text-sm text-slate-400 mb-2">
          Business &gt; {title}
        </div>
      </div>

      {/* Date filters and action buttons */}
      <div className="flex flex-wrap items-end justify-between mb-6 gap-4">
        <div className="flex items-end space-x-4">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col">
              <label className="text-sm text-slate-400 mb-1">{filter.label}</label>
              {filter.type === 'date' ? (
                <input
                  type="date"
                  className="bg-slate-800 border border-slate-700 rounded px-12 py-2 text-white text-sm h-10"
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              ) : filter.type === 'select' ? (
                <select
                  className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm min-w-[150px] h-10"
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                >
                  <option value="">All {filter.label}</option>
                  {filter.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={filter.placeholder}
                  className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm h-10"
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              )}
            </div>
          ))}
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-2 rounded transition-colors h-10">
            Search
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {showExportPrint && (
            <>
              <button className="bg-slate-950 border-amber-600 border-1 hover:bg-slate-600 text-white px-12 py-2 rounded transition-colors">
                Export
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-12 py-2 rounded transition-colors">
                Print
              </button>
            </>
          )}
          {showAddButton && onAdd && (
            <button 
              onClick={onAdd}
              className="bg-orange-500 hover:bg-orange-600 text-white px-12 ml-8 py-2 rounded flex items-center space-x-2 transition-colors"
            >
              <FaPlus className="text-sm" />
              <span>{addButtonText}</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-gray-300 via-30% via-gray-700 to-gray-800">
          <div className="rounded-2xl bg-gray-900">

                {/* Table controls */}
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
                      placeholder={searchPlaceholder}
                      className="bg-slate-800 border border-slate-700 rounded pl-10 pr-4 py-2 text-white text-sm w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Data Table */}
                <div className="border border-slate-700 overflow-hidden bg-slate-900 rounded-2xl">
                  <table className="w-full table-fixed">
                    <thead className="bg-orange-500">
                      <tr>
                        {columns.map((column, index) => (
                          <th
                            key={column.key}
                            className={`px-4 py-3 text-left text-white font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap ${
                              index < columns.length - 1 ? 'border-r border-orange-400' : ''
                            }`}
                          >
                            {column.label}
                            {column.sortable && <span className="ml-1 text-xs">↕</span>}
                          </th>
                        ))}
                        {showActions && (
                          <th className="px-4 py-3 text-left text-white font-medium text-sm border-l border-orange-400">
                            Actions
                          </th>
                        )}
                      </tr>
                      
                      {/* Column filters row - EVERY column gets a search */}
                      <tr className="bg-slate-900">
                        {columns.map((column, index) => (
                          <td
                            key={`filter-${column.key}`}
                            className={`px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap ${
                              index < columns.length - 1 ? 'border-r border-slate-600' : ''
                            }`}
                          >
                            <input
                              type="text"
                              placeholder={`Search ${column.label}`}
                              className="h-10 w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-gray-200 text-xs overflow-hidden text-ellipsis whitespace-nowrap"
                              value={filterValues[column.key] || ''}
                              onChange={(e) => handleFilterChange(column.key, e.target.value)}
                            />
                          </td>
                        ))}
                        {showActions && (
                          <td className="px-4 py-2 border-l border-slate-600 overflow-hidden text-ellipsis whitespace-nowrap">
                            <input
                              type="text"
                              placeholder="Search Actions"
                              className="h-10 w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-gray-200 text-xs overflow-hidden text-ellipsis whitespace-nowrap"
                              value={filterValues['actions'] || ''}
                              onChange={(e) => handleFilterChange('actions', e.target.value)}
                            />
                          </td>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Data rows */}
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item, rowIndex) => (
                          <tr
                            key={item.id || rowIndex}
                            className={`border-b border-slate-700 transition-colors ${
                              rowIndex % 2 === 0 ? 'bg-slate-800' : 'bg-slate-850'
                            } ${clickableRows ? 'hover:bg-slate-600 cursor-pointer' : 'hover:bg-slate-700'}`}
                            onClick={() => clickableRows && handleRowClick(item)}
                          >
                            {columns.map((column, colIndex) => (
                              <td
                                key={column.key}
                                className={`px-4 py-3 text-gray-400 text-sm overflow-hidden text-ellipsis whitespace-nowrap ${
                                  colIndex < columns.length - 1 ? 'border-r border-slate-600' : ''
                                }`}
                              >
                                {column.render ? column.render(item[column.key], item) : item[column.key]}
                              </td>
                            ))}
                            {showActions && (
                              <td className="px-4 py-3 border-l border-slate-600">
                                <div className="flex space-x-2 justify-center">
                                  
                                  
                                  {/* Edit Button */}
                                  {onEdit && (
                              <button
          onClick={(e) => handleEdit(item, e)}
          className="p-2 flex items-center space-x-2 text-white rounded transition-colors"
          title="Edit"
        >
          <span>Edit</span>
          <FaEdit className="text-sm" />
        </button>

                                  )}
                                  
                                  
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-4 py-8 text-center text-slate-400">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              
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

// FullScreenModal component (keep the same structure but ensure ALL columns have search)
const FullScreenModal = ({ modalData, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Enhanced filter logic for modal
  const filteredData = modalData.data.filter(item => {
    const matchesSearch = searchTerm === '' || 
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesFilters = Object.entries(filterValues).every(([key, value]) =>
      !value || String(item[key] || '').toLowerCase().includes(String(value).toLowerCase())
    );
    
    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (filterKey, value) => {
    setFilterValues(prev => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-950 p-6 min-h-screen">
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <div className="text-sm text-slate-400 mb-2">
          Business &gt; Meetings &gt; Meeting Details
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            {modalData.title}
          </h1>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            <span>Back to Meetings</span>
          </button>
        </div>
      </div>

      {/* Meeting Info Card */}
      <div className="max-w-full mx-auto">
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Meeting Date</label>
              <p className="text-white">{modalData.meetingInfo?.meetingDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Entered By</label>
              <p className="text-white">{modalData.meetingInfo?.enteredBy}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Entered Date</label>
              <p className="text-white">{modalData.meetingInfo?.enteredDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
              <span className={`px-2 py-1 rounded text-xs ${
                modalData.meetingInfo?.status === 'Completed' ? 'bg-green-600 text-white' : 
                modalData.meetingInfo?.status === 'Scheduled' ? 'bg-blue-600 text-white' : 
                modalData.meetingInfo?.status === 'Cancelled' ? 'bg-red-600 text-white' :
                'bg-yellow-600 text-white'
              }`}>
                {modalData.meetingInfo?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Meeting Details Table */}
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Attendee Details</h2>
          
          {/* Table controls */}
          <div className="flex items-center justify-between mb-4">
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
                placeholder="Search attendees..."
                className="bg-slate-800 border border-slate-700 rounded pl-10 pr-4 py-2 text-white text-sm w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Data Table with column filters for ALL columns */}
          <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800">
            <table className="w-full">
              <thead className="bg-orange-500">
                <tr>
                  {modalData.columns.map((column, index) => (
                    <th key={column.key} className={`px-4 py-3 text-left text-white font-medium text-sm ${
                      index < modalData.columns.length - 1 ? 'border-r border-orange-400' : ''
                    }`}>
                      {column.label}
                      {column.sortable && <span className="ml-1 text-xs">↕</span>}
                    </th>
                  ))}
                </tr>
                
                {/* Column filters row - EVERY column gets search */}
                <tr className="bg-slate-800">
                  {modalData.columns.map((column, index) => (
                    <td key={`filter-${column.key}`} className={`px-4 py-2 ${
                      index < modalData.columns.length - 1 ? 'border-r border-slate-600' : ''
                    }`}>
                      <input
                        type="text"
                        placeholder={`Search ${column.label}`}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                        value={filterValues[column.key] || ''}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Data rows */}
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, rowIndex) => (
                    <tr key={item.id || rowIndex} className={`border-b border-slate-600 hover:bg-slate-700 transition-colors ${
                      rowIndex % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'
                    }`}>
                      {modalData.columns.map((column, colIndex) => (
                        <td key={column.key} className={`px-4 py-3 text-slate-300 text-sm ${
                          colIndex < modalData.columns.length - 1 ? 'border-r border-slate-600' : ''
                        }`}>
                          {column.render ? column.render(item[column.key], item) : item[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={modalData.columns.length} className="px-4 py-8 text-center text-slate-400">
                      No attendee data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
      </div>
    </div>
  );
};

// DataForm component remains the same
const DataForm = ({ 
  title, 
  fields = [], 
  editFields = null,
  onSubmit, 
  onCancel, 
  initialData = {},
  submitText = "Submit",
  cancelText = "Cancel",
  isLoading = false,
  isEdit = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const currentFields = isEdit && editFields ? editFields : fields;

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
      if (field.validation && formData[field.key]) {
        const validationResult = field.validation(formData[field.key]);
        if (validationResult !== true) {
          newErrors[field.key] = validationResult;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      className: `w-full bg-slate-800 border rounded px-3 py-2 text-white ${
        errors[field.key] ? 'border-red-500' : 'border-slate-700'
      } ${field.disabled ? 'opacity-60 cursor-not-allowed' : ''}`,
      value: formData[field.key] || field.value || '',
      onChange: (e) => handleFieldChange(field.key, e.target.value),
      placeholder: field.placeholder,
      disabled: field.disabled || false
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
      case 'textarea':
        return (
          <textarea 
            {...commonProps} 
            rows={field.rows || 3}
            placeholder={field.placeholder}
          />
        );
      case 'date':
        return <input type="date" {...commonProps} />;
      case 'email':
        return <input type="email" {...commonProps} />;
      case 'number':
        return <input type="number" {...commonProps} />;
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <div className="bg-slate-950 p-6">
      <div className="mb-6">
        <div className="text-sm text-slate-400 mb-2">
          Business &gt; {title}
        </div>
      </div>
    
        <div className=" flex items-center justify-center bg-slate-950">
  <div className="relative max-w-4xl w-full rounded-2xl p-[2px] bg-gradient-to-br from-gray-300 via-gray-700 to-gray-800">
    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`${
            currentFields.length < 10
              ? "space-y-6"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          }`}
        >
          {currentFields.map((field) => (
            <div
              key={field.key}
              className={
                field.type === "textarea" && currentFields.length >= 10
                  ? "md:col-span-2 lg:col-span-3"
                  : ""
              }
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              {renderField(field)}
              {errors[field.key] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[field.key]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-700">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
              disabled={isLoading}
            >
              {cancelText}
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : submitText}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

    </div>
  );
};

export { DataTable, DataForm };