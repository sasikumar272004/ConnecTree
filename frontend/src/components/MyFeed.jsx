import React, { useState } from 'react';
import { 
  Heart, MessageSquare, Share, Send, MoreHorizontal, 
  Bookmark, Users, Bell, Search, Plus, Camera, Video, 
  Image, Smile, ThumbsUp, Edit3, MapPin, Calendar,
  Eye, Copy, Flag, Menu, X
} from 'lucide-react';

const MyFeedComponent = () => {
  const [activeTab, setActiveTab] = useState('My Feeds');
  const [postText, setPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Sample data - replace with real data
  const userProfile = {
    name: 'Mike Josh',
    title: 'MJ Tech Solution',
    role: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    posts: '2.8K',
    connections: '25K'
  };

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
    },
    { 
      name: 'Mike', 
      message: 'Mike volia Noa teasing you...', 
      time: 'Jan 24', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      unread: false 
    },
    { 
      name: 'Horik', 
      message: 'Horik volia Noa teasing you...', 
      time: 'Dec 24, 2024', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
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
    },
    { 
      name: 'Startups', 
      description: 'A community for small business owners and entrepreneurs who want to grow smarter...', 
      time: 'Dec 24, 2024',
      avatar: 'https://images.unsplash.com/photo-1553028826-f4804151e596?w=50&h=50&fit=crop',
      members: '856'
    }
  ];

  const feedPosts = [
    {
      id: 1,
      author: 'Roni Kuku (You)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face',
      content: 'Exciting Figma Update: Enhanced Color Contrast Feature in Color Picker!\n\nGreat news for designers! Figma now offers a Color Contrast feature within the Color Picker, streamlining accessibility checks.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop',
      likes: 250,
      comments: 15,
      shares: 8,
      time: '2h',
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      author: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e5f3b5?w=60&h=60&fit=crop&crop=face',
      content: 'Just launched our new mobile app! 🚀 Thanks to everyone who supported us during the development phase. Here\'s to new beginnings and exciting opportunities ahead.',
      likes: 89,
      comments: 23,
      shares: 12,
      time: '4h',
      location: 'New York, NY'
    }
  ];

  const handleLike = (postId) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  const handleSave = (postId) => {
    const newSaved = new Set(savedPosts);
    if (newSaved.has(postId)) {
      newSaved.delete(postId);
    } else {
      newSaved.add(postId);
    }
    setSavedPosts(newSaved);
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-bold text-white">My Feed</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 lg:px-6 py-4 border-b border-gray-800 bg-gray-900">
        <div className="w-full mx-auto">
          <div className="flex items-center text-sm">
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Business</span>
            <span className="mx-2 text-gray-600">{'>'}</span>
            <span className="text-orange-400 font-medium">My Feed</span>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Hidden on mobile, shown when menu is open */}
          <div className={`
            ${isMobileMenuOpen ? 'block' : 'hidden'} 
            lg:block lg:w-80 lg:flex-shrink-0
          `}>
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Profile Card */}
              <div className="bg-gray-900 rounded-xl p-4 lg:p-6 border border-gray-800 shadow-xl">
                <div className="flex items-center mb-4 lg:mb-6">
                  <div className="relative">
                    <img
                      src={userProfile.avatar}
                      alt="Profile"
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover ring-4 ring-gray-800"
                    />
                    <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 bg-orange-500 rounded-full flex items-center justify-center border-4 border-gray-900 hover:bg-orange-600 cursor-pointer transition-colors">
                      <Camera className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3 lg:ml-4 flex-1 min-w-0">
                    <h3 className="font-bold text-lg lg:text-xl text-white truncate">{userProfile.name}</h3>
                    <p className="text-orange-400 text-xs lg:text-sm font-medium truncate">{userProfile.title}</p>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">{userProfile.role}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4 py-3 lg:py-4 border-t border-gray-800">
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-white">{userProfile.posts}</div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">POSTS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-white">{userProfile.connections}</div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">CONNECTIONS</div>
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="flex gap-2 mt-3 lg:mt-4">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 lg:px-4 rounded-lg font-medium transition-colors text-sm lg:text-base">
                    <Edit3 className="w-3 h-3 lg:w-4 lg:h-4 inline mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-xl">
                {['My Feeds', 'Saved Posts'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 lg:px-6 py-3 lg:py-4 text-left font-medium transition-all duration-200 flex items-center justify-between ${
                      activeTab === tab
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="text-sm lg:text-base">{tab}</span>
                    {tab === 'Saved Posts' && (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Feed */}
          <div className="flex-1 min-w-0">
            <div className="space-y-4 lg:space-y-6">
              {/* Post Creation */}
              <div className="bg-gray-900 rounded-xl p-4 lg:p-6 border border-gray-800 shadow-xl">
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <img
                    src={userProfile.avatar}
                    alt="Your avatar"
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-gray-700 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <textarea
                      placeholder="Start a post"
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      className="w-full bg-gray-800 rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700 transition-all text-sm lg:text-base"
                      rows="3"
                    />
                    <div className="flex items-center justify-between mt-3 lg:mt-4">
                      <div className="flex items-center space-x-2 lg:space-x-4 overflow-x-auto pb-2">
                        <button className="flex items-center space-x-1 lg:space-x-2 text-gray-400 hover:text-orange-500 transition-colors p-2 rounded-lg hover:bg-gray-800 flex-shrink-0">
                          <Image className="w-4 h-4 lg:w-5 lg:h-5" />
                          <span className="text-xs lg:text-sm font-medium">Photo</span>
                        </button>
                        <button className="flex items-center space-x-1 lg:space-x-2 text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-gray-800 flex-shrink-0">
                          <Video className="w-4 h-4 lg:w-5 lg:h-5" />
                          <span className="text-xs lg:text-sm font-medium">Video</span>
                        </button>
                        <button className="text-gray-400 hover:text-yellow-500 transition-colors p-2 rounded-lg hover:bg-gray-800 flex-shrink-0">
                          <Smile className="w-4 h-4 lg:w-5 lg:h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-lg hover:bg-gray-800 flex-shrink-0">
                          <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                        </button>
                      </div>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 lg:px-8 py-2 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl text-sm lg:text-base flex-shrink-0">
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed Posts */}
              {feedPosts.map((post) => (
                <div key={post.id} className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4 lg:p-6 pb-3 lg:pb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-gray-700"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white text-sm lg:text-base truncate">{post.author}</h4>
                        <div className="flex items-center text-gray-400 text-xs lg:text-sm space-x-1 lg:space-x-2 flex-wrap">
                          <span>{post.time} ago</span>
                          {post.location && (
                            <>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{post.location}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="text-gray-400 hover:text-white p-1 lg:p-2 rounded-lg hover:bg-gray-800 transition-colors">
                        <MoreHorizontal className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 lg:px-6 pb-3 lg:pb-4">
                    <p className="text-gray-200 whitespace-pre-line leading-relaxed text-sm lg:text-base">{post.content}</p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="px-4 lg:px-6 pb-3 lg:pb-4">
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full rounded-xl object-cover max-h-48 lg:max-h-96 border border-gray-800"
                      />
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="px-4 lg:px-6 py-2 text-xs lg:text-sm text-gray-400">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 lg:space-x-4">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                        {post.shares && <span>{post.shares} shares</span>}
                      </div>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="px-4 lg:px-6 py-3 lg:py-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 lg:space-x-1 w-full justify-between lg:justify-start">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-1 lg:py-2 rounded-lg transition-all flex-1 lg:flex-none justify-center ${
                            likedPosts.has(post.id)
                              ? 'text-red-500 bg-red-500/10'
                              : 'text-gray-400 hover:text-red-500 hover:bg-gray-800'
                          }`}
                        >
                          <Heart className={`w-4 h-4 lg:w-5 lg:h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          <span className="font-medium text-xs lg:text-sm">Like</span>
                        </button>
                        <button className="flex items-center space-x-1 lg:space-x-2 text-gray-400 hover:text-blue-500 px-2 lg:px-4 py-1 lg:py-2 rounded-lg hover:bg-gray-800 transition-all flex-1 lg:flex-none justify-center">
                          <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5" />
                          <span className="font-medium text-xs lg:text-sm">Comment</span>
                        </button>
                        <button className="flex items-center space-x-1 lg:space-x-2 text-gray-400 hover:text-green-500 px-2 lg:px-4 py-1 lg:py-2 rounded-lg hover:bg-gray-800 transition-all flex-1 lg:flex-none justify-center">
                          <Share className="w-4 h-4 lg:w-5 lg:h-5" />
                          <span className="font-medium text-xs lg:text-sm">Share</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => handleSave(post.id)}
                        className={`p-2 rounded-lg transition-all ml-2 ${
                          savedPosts.has(post.id)
                            ? 'text-orange-500 bg-orange-500/10'
                            : 'text-gray-400 hover:text-orange-500 hover:bg-gray-800'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 lg:w-5 lg:h-5 ${savedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile */}
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
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm text-white truncate">{group.name}</h4>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{group.time}</span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-2">{group.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{group.members} members</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-3">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center space-y-1 p-2 text-orange-500"
          >
            <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
            <span className="text-xs font-medium">Menu</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-gray-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="text-xs">Notifications</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-gray-400 hover:text-white transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyFeedComponent;