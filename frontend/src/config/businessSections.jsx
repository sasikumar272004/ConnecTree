// config/businessSections.js
import React from 'react';

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
              value === 'Completed' ? 'bg-green-600 text-white' : 
              value === 'Scheduled' ? 'bg-blue-600 text-white' : 
              'bg-yellow-600 text-white'
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
    data: [
      {
        id: 1,
        date: '10/08/2025',
        meetWith: 'David',
        initiatedBy: 'Mike',
        location: 'Office',
        topics: 'Discussed about each other\'s businesses and future collaboration...',
        status: 'Completed'
      },
      {
        id: 2,
        date: '19/08/2025',
        meetWith: 'Phillips',
        initiatedBy: 'John',
        location: 'Cafe',
        topics: 'Business discuss',
        status: 'Completed'
      }
    ]
  },

  'business-opportunity-received': {
    title: 'Business Opportunity Received',
    tableConfig: {
      columns: [
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
              value === 'Closed' ? 'bg-green-600 text-white' : 
              value === 'In Progress' ? 'bg-blue-600 text-white' : 
              value === 'New' ? 'bg-yellow-600 text-white' :
              'bg-gray-600 text-white'
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
              <span>{value}</span>
              <button
                onClick={() => window.handleAddBusinessClosed && window.handleAddBusinessClosed(item)}
                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
              >
                Add Business Closed
              </button>
            </div>
          )
        }
      ],
      filters: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ],
      searchPlaceholder: 'Search opportunities...',
      showExportPrint: false,
      showAddButton: false
    },
    formConfig: {
      title: 'Add Business Opportunity Received',
      fields: [
        {
          key: 'referralName',
          label: 'Referral Name',
          type: 'text',
          required: true,
          placeholder: 'Enter referral name'
        },
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'Enter email address'
        },
        {
          key: 'phone',
          label: 'Phone',
          type: 'text',
          required: true,
          placeholder: 'Enter phone number'
        },
        {
          key: 'date',
          label: 'Date',
          type: 'date',
          required: true
        },
        {
          key: 'businessClosed',
          label: 'Business Closed',
          type: 'select',
          required: false,
          placeholder: 'Select status',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]
        }
      ],
      submitText: 'Submit',
      cancelText: 'Cancel'
    },
    data: [
      {
        id: 1,
        referralName: 'John Anderson',
        email: 'john.anderson@email.com',
        phone: '+1-555-0123',
        date: '2025-09-15',
        status: 'New',
        businessClosed: 'no'
      },
      {
        id: 2,
        referralName: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        phone: '+1-555-0456',
        date: '2025-09-18',
        status: 'In Progress',
        businessClosed: 'no'
      },
      {
        id: 3,
        referralName: 'Michael Chen',
        email: 'mchen@techcorp.com',
        phone: '+1-555-0789',
        date: '2025-09-20',
        status: 'Closed',
        businessClosed: 'yes'
      },
      {
        id: 4,
        referralName: 'Emily Rodriguez',
        email: 'emily.r@startup.io',
        phone: '+1-555-0321',
        date: '2025-09-22',
        status: 'New',
        businessClosed: 'no'
      },
      {
        id: 5,
        referralName: 'David Thompson',
        email: 'dthompson@consulting.com',
        phone: '+1-555-0654',
        date: '2025-09-23',
        status: 'In Progress',
        businessClosed: 'no'
      }
    ]
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
              value === 'Completed' ? 'bg-green-600 text-white' : 
              value === 'In Progress' ? 'bg-blue-600 text-white' : 
              value === 'Pending' ? 'bg-yellow-600 text-white' :
              'bg-gray-600 text-white'
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
              value === 'Active' ? 'bg-green-600 text-white' : 
              value === 'Inactive' ? 'bg-red-600 text-white' : 
              'bg-gray-600 text-white'
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
    data: [
      {
        id: 1,
        date: '2025-09-16',
        to: 'David Smith',
        referral: 'Tech Solutions Inc',
        email: 'contact@techsolutions.com',
        phone: '+1-555-2345',
        type: 'Direct',
        referralStatus: 'Completed',
        comments: 'Successfully connected for software development project',
        status: 'Active'
      },
      {
        id: 2,
        date: '2025-09-19',
        to: 'Phillips Johnson',
        referral: 'Marketing Pro Agency',
        email: 'info@marketingpro.com',
        phone: '+1-555-6789',
        type: 'Indirect',
        referralStatus: 'In Progress',
        comments: 'Initial meeting scheduled for next week',
        status: 'Active'
      },
      {
        id: 3,
        date: '2025-09-21',
        to: 'Mike Williams',
        referral: 'Finance Experts LLC',
        email: 'hello@financeexperts.com',
        phone: '+1-555-9876',
        type: 'Consultation',
        referralStatus: 'Pending',
        comments: 'Waiting for client response on consultation proposal',
        status: 'Active'
      }
    ]
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
    data: [
      {
        id: 1,
        date: '2025-09-15',
        to: 'David Smith',
        amount: '25000',
        businessType: 'Consulting',
        referralType: 'Direct Referral',
        comments: 'Successfully closed consulting project for new client',
        status: 'Completed'
      },
      {
        id: 2,
        date: '2025-09-18',
        to: 'Phillips Johnson',
        amount: '45000',
        businessType: 'Software Development',
        referralType: 'Indirect Referral',
        comments: 'Web development project completed on time',
        status: 'Completed'
      },
      {
        id: 3,
        date: '2025-09-20',
        to: 'Mike Williams',
        amount: '18500',
        businessType: 'Marketing Services',
        referralType: 'Direct Referral',
        comments: 'Digital marketing campaign delivered excellent results',
        status: 'Completed'
      },
      {
        id: 4,
        date: '2025-09-22',
        to: 'David Smith',
        amount: '32000',
        businessType: 'Real Estate',
        referralType: 'Self Generated',
        comments: 'Property sale commission received',
        status: 'In Progress'
      },
      {
        id: 5,
        date: '2025-09-23',
        to: 'Phillips Johnson',
        amount: '15000',
        businessType: 'Finance',
        referralType: 'Indirect Referral',
        comments: 'Financial planning services for corporate client',
        status: 'Completed'
      }
    ]
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
              value === 'Completed' ? 'bg-green-600 text-white' : 
              value === 'Scheduled' ? 'bg-blue-600 text-white' : 
              value === 'Cancelled' ? 'bg-red-600 text-white' :
              'bg-yellow-600 text-white'
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
      addButtonText: 'Schedule Meeting',
      searchPlaceholder: 'Search meetings...',
      showActions: false
    },
    formConfig: {
      title: 'Schedule Meeting',
      fields: [
        {
          key: 'meetingDate',
          label: 'Meeting Date',
          type: 'date',
          required: true
        },
        {
          key: 'enteredBy',
          label: 'Entered by',
          type: 'select',
          required: true,
          placeholder: 'Select member',
          options: [
            { value: 'david', label: 'David Smith' },
            { value: 'phillips', label: 'Phillips Johnson' },
            { value: 'mike', label: 'Mike Williams' }
          ]
        },
        {
          key: 'enteredDate',
          label: 'Entered date',
          type: 'date',
          required: true
        }
      ],
      submitText: 'Submit',
      cancelText: 'Cancel'
    },
    data: [
      {
        id: 1,
        meetingDate: '2025-09-25',
        enteredBy: 'David Smith',
        enteredDate: '2025-09-20',
        status: 'Scheduled'
      },
      {
        id: 2,
        meetingDate: '2025-09-18',
        enteredBy: 'Phillips Johnson',
        enteredDate: '2025-09-15',
        status: 'Completed'
      },
      {
        id: 3,
        meetingDate: '2025-09-30',
        enteredBy: 'Mike Williams',
        enteredDate: '2025-09-22',
        status: 'Scheduled'
      },
      {
        id: 4,
        meetingDate: '2025-09-12',
        enteredBy: 'David Smith',
        enteredDate: '2025-09-10',
        status: 'Cancelled'
      },
      {
        id: 5,
        meetingDate: '2025-09-28',
        enteredBy: 'Phillips Johnson',
        enteredDate: '2025-09-23',
        status: 'Scheduled'
      }
    ]
  },

  'connections': {
    title: 'Connections',
    tableConfig: {
      columns: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone', sortable: true },
        { key: 'company', label: 'Company', sortable: true },
        { key: 'connectionDate', label: 'Connection Date', sortable: true },
        { 
          key: 'status', 
          label: 'Status', 
          sortable: true,
          render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
              value === 'Active' ? 'bg-green-600 text-white' : 
              value === 'Inactive' ? 'bg-red-600 text-white' : 
              'bg-gray-600 text-white'
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
      addButtonText: 'Add Connection',
      searchPlaceholder: 'Search connections...'
    },
    formConfig: {
      title: 'Add Connection',
      fields: [
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          placeholder: 'Enter name'
        },
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'Enter email'
        },
        {
          key: 'phone',
          label: 'Phone',
          type: 'text',
          required: true,
          placeholder: 'Enter phone'
        },
        {
          key: 'company',
          label: 'Company',
          type: 'text',
          required: false,
          placeholder: 'Enter company'
        },
        {
          key: 'connectionDate',
          label: 'Connection Date',
          type: 'date',
          required: true
        }
      ],
      submitText: 'Submit',
      cancelText: 'Cancel'
    },
    data: [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1-555-1111',
        company: 'Tech Corp',
        connectionDate: '2025-09-15',
        status: 'Active'
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@company.com',
        phone: '+1-555-2222',
        company: 'Marketing Inc',
        connectionDate: '2025-09-18',
        status: 'Active'
      }
    ]
  },

  'testimonials': {
    title: 'Testimonials',
    tableConfig: {
      columns: [
        { key: 'clientName', label: 'Client Name', sortable: true },
        { key: 'company', label: 'Company', sortable: true },
        { key: 'testimonial', label: 'Testimonial', sortable: false },
        { key: 'rating', label: 'Rating', sortable: true },
        { key: 'date', label: 'Date', sortable: true },
        { 
          key: 'status', 
          label: 'Status', 
          sortable: true,
          render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
              value === 'Published' ? 'bg-green-600 text-white' : 
              value === 'Draft' ? 'bg-yellow-600 text-white' : 
              'bg-gray-600 text-white'
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
      addButtonText: 'Add Testimonial',
      searchPlaceholder: 'Search testimonials...'
    },
    formConfig: {
      title: 'Add Testimonial',
      fields: [
        {
          key: 'clientName',
          label: 'Client Name',
          type: 'text',
          required: true,
          placeholder: 'Enter client name'
        },
        {
          key: 'company',
          label: 'Company',
          type: 'text',
          required: false,
          placeholder: 'Enter company'
        },
        {
          key: 'testimonial',
          label: 'Testimonial',
          type: 'textarea',
          required: true,
          placeholder: 'Enter testimonial',
          rows: 4
        },
        {
          key: 'rating',
          label: 'Rating',
          type: 'select',
          required: true,
          placeholder: 'Select rating',
          options: [
            { value: '5', label: '5 Stars' },
            { value: '4', label: '4 Stars' },
            { value: '3', label: '3 Stars' },
            { value: '2', label: '2 Stars' },
            { value: '1', label: '1 Star' }
          ]
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
    data: [
      {
        id: 1,
        clientName: 'John Doe',
        company: 'ABC Corp',
        testimonial: 'Excellent service and professional approach. Highly recommended!',
        rating: '5',
        date: '2025-09-15',
        status: 'Published'
      },
      {
        id: 2,
        clientName: 'Jane Smith',
        company: 'XYZ Ltd',
        testimonial: 'Great experience working with them. Very satisfied with the results.',
        rating: '4',
        date: '2025-09-18',
        status: 'Published'
      }
    ]
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
    data: [
      {
        id: 1,
        eventName: 'Networking Breakfast',
        startDateTime: '2025-09-25 08:00 AM',
        location: 'Conference Hall A'
      },
      {
        id: 2,
        eventName: 'Business Workshop',
        startDateTime: '2025-09-28 02:00 PM',
        location: 'Training Center'
      },
      {
        id: 3,
        eventName: 'Annual Meeting',
        startDateTime: '2025-10-05 10:00 AM',
        location: 'Main Auditorium'
      }
    ]
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
    data: [
      {
        id: 1,
        visitorName: 'David Johnson',
        email: 'david66@gmail.com',
        phone: '9988776655',
        visitDate: '2025-09-24',
        companyName: 'NC Limited',
        registrationType: 'visitor',
        registrationChapter: 'ekam-iconic',
        firstName: 'David',
        lastName: 'Johnson',
        category: 'advertising-agency',
        streetAddress: '1266, KPHB Phase 1',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500072',
        country: 'India'
      },
      {
        id: 2,
        visitorName: 'Sarah Wilson',
        email: 'sarah.w@company.com',
        phone: '9876543210',
        visitDate: '2025-09-26',
        companyName: 'Tech Solutions',
        registrationType: 'guest',
        registrationChapter: 'ekam-elite',
        firstName: 'Sarah',
        lastName: 'Wilson',
        category: 'technology',
        streetAddress: '456 Tech Park',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    ]
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
              value === 'Published' ? 'bg-green-600 text-white' : 
              value === 'Draft' ? 'bg-yellow-600 text-white' : 
              'bg-gray-600 text-white'
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
    data: [
      {
        id: 1,
        title: 'Networking Success Story',
        content: 'Great networking event last week. Met amazing professionals and made valuable connections.',
        author: 'John Smith',
        publishDate: '2025-09-20',
        category: 'networking',
        status: 'Published'
      },
      {
        id: 2,
        title: 'Business Opportunity Alert',
        content: 'New business opportunities available in tech sector. Interested members please reach out.',
        author: 'Jane Doe',
        publishDate: '2025-09-22',
        category: 'business',
        status: 'Published'
      }
    ]
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
              value === 'Completed' ? 'bg-green-600 text-white' : 
              value === 'Scheduled' ? 'bg-blue-600 text-white' : 
              value === 'Cancelled' ? 'bg-red-600 text-white' :
              'bg-yellow-600 text-white'
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
    data: [
      {
        id: 1,
        meetingDate: '2025-09-25',
        enteredBy: 'David Smith',
        enteredDate: '2025-09-20',
        status: 'Scheduled'
      },
      {
        id: 2,
        meetingDate: '2025-09-18',
        enteredBy: 'Phillips Johnson',
        enteredDate: '2025-09-15',
        status: 'Completed'
      },
      {
        id: 3,
        meetingDate: '2025-09-30',
        enteredBy: 'Mike Williams',
        enteredDate: '2025-09-22',
        status: 'Scheduled'
      }
    ]
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