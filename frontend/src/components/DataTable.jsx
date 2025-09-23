// components/DataTable.js
import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const DataTable = ({ 
  title, 
  data = [], 
  columns = [], 
  onAdd, 
  onEdit, 
  onView, 
  onDelete,
  filters = [],
  showActions = true,
  showExportPrint = true,
  showAddButton = true,
  addButtonText = "Add",
  searchPlaceholder = "Search..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and search logic
  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesFilters = Object.entries(filterValues).every(([key, value]) =>
      !value || String(item[key]).toLowerCase().includes(String(value).toLowerCase())
    );
    
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

  return (
    <div className="bg-slate-950 p-6">
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <div className="text-sm text-slate-400 mb-2">
          Business &gt; {title}
        </div>
      </div>

      {/* Date filters and action buttons */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col">
              <label className="text-sm text-slate-400 mb-1">{filter.label}</label>
              {filter.type === 'date' ? (
                <input
                  type="date"
                  className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              ) : filter.type === 'select' ? (
                <select
                  className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm min-w-[150px]"
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
                  className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              )}
            </div>
          ))}
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition-colors">
            Search
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {showExportPrint && (
            <>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors">
                Export
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors">
                Print
              </button>
            </>
          )}
          {showAddButton && onAdd && (
            <button 
              onClick={onAdd}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center space-x-2 transition-colors"
            >
              <FaPlus className="text-sm" />
              <span>{addButtonText}</span>
            </button>
          )}
        </div>
      </div>

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
            placeholder={searchPlaceholder}
            className="bg-slate-800 border border-slate-700 rounded pl-10 pr-4 py-2 text-white text-sm w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-orange-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-white font-medium text-sm">
                  {column.label}
                  {column.sortable && <span className="ml-1 text-xs">↕</span>}
                </th>
              ))}
              {showActions && <th className="px-4 py-3 text-left text-white font-medium text-sm">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {/* Column filters row */}
            <tr className="bg-slate-800">
              {columns.map((column) => (
                <td key={`filter-${column.key}`} className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                    value={filterValues[column.key] || ''}
                    onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  />
                </td>
              ))}
              {showActions && <td className="px-4 py-2"></td>}
            </tr>
            
            {/* Data rows */}
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item.id || index} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-slate-300 text-sm">
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View"
                          >
                            <FaEye className="text-sm" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="text-sm" />
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

// components/DataForm.js
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

  // Use editFields if provided and isEdit is true, otherwise use regular fields
  const currentFields = isEdit && editFields ? editFields : fields;

  const handleFieldChange = (fieldKey, value) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
    // Clear error when user starts typing
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
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <div className="text-sm text-slate-400 mb-2">
          Business &gt; {title}
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Create a grid layout for the form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFields.map((field) => (
                <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2 lg:col-span-3' : ''}>
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

            {/* Form Actions */}
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
                {isLoading ? 'Submitting...' : submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { DataTable, DataForm };