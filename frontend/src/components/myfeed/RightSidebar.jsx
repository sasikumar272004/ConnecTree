import React from 'react';
import { Edit3, Plus } from 'lucide-react';

const RightSidebar = () => {
  const messages = [
    { 
      name: 'Horik', 
      message: 'Horik volia Noa teasing you...', 
      time: '6:04 PM', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      unread: true 
    },
    { 
      name: 'Sony', 
      message: 'Sony volia Noa teasing you...', 
      time: 'Aug 24', 
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e5f3b5?w=50&h=50&fit=crop&crop=face',
      unread: false 
    }
  ];

  const groups = [
    { 
      name: 'Business Opportunities', 
      description: 'Anyone seeking opportunity or has a opportunity to let others know can use this community...', 
      time: 'Mar 10',
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop',
      members: '1.2K'
    }
  ];

  return (
    <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
      <div className="space-y-6 sticky top-6">
        {/* Messages */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-white">Messages</h3>
            <button className="text-gray-400 hover:text-orange-500 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                <div className="relative">
                  <img
                    src={message.avatar}
                    alt={message.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {message.unread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-gray-900"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${message.unread ? 'text-white' : 'text-gray-300'}`}>
                      {message.name}
                    </h4>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className={`text-xs truncate ${message.unread ? 'text-gray-300' : 'text-gray-500'}`}>
                    {message.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Groups */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-white">My Groups</h3>
            <button className="text-gray-400 hover:text-orange-500 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {groups.map((group, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{group.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{group.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                    <span>{group.time}</span>
                    <span>•</span>
                    <span>{group.members} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;