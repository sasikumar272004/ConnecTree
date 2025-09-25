import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, MessageSquare, Share, Send, MoreHorizontal, 
  Bookmark, Users, Bell, Search, Plus, Camera, Video, 
  Image, Smile, ThumbsUp, Edit3, MapPin, Calendar,
  Eye, Copy, Flag, Menu, X, Loader2, Upload, File
} from 'lucide-react';

const MyFeedComponent = () => {
  const [activeTab, setActiveTab] = useState('My Feeds');
  const [postText, setPostText] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [savedPostsData, setSavedPostsData] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [feedPosts, setFeedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ totalPosts: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Sample user profile
  const userProfile = {
    name: 'Clark Ron',
    title: 'Developer',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    posts: '2.8K',
    connections: '25K',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=150&fit=crop'
  };

  // API Configuration
  const API_BASE_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');
  
  // Initialize component by fetching posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fixed fetchPosts function
  const fetchPosts = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        const posts = data.data?.posts || [];
        const paginationData = data.data?.pagination || {};

        // Debug: Log media data for posts
        posts.forEach(post => {
          if (post.media && post.media.length > 0) {
            console.log('Post media:', post.media);
          }
        });

        if (page === 1) {
          setFeedPosts(posts);
        } else {
          setFeedPosts(prev => [...prev, ...posts]);
        }

        // Update pagination
        setPagination({
          totalPosts: paginationData.totalPosts || posts.length,
          currentPage: paginationData.currentPage || page,
          hasMore: paginationData.hasNext || false
        });

        // Initialize liked posts from the fetched data
        const userLikedPosts = new Set();
        posts.forEach(post => {
          if (post.likedBy && Array.isArray(post.likedBy)) {
            // Check if current user has liked this post
            // You might need to get current user ID from your auth context
            const currentUserId = 'current-user-id'; // Replace with actual user ID
            if (post.likedBy.includes(currentUserId)) {
              userLikedPosts.add(post._id);
            }
          }
        });
        setLikedPosts(userLikedPosts);
        
      } else {
        throw new Error(data.message || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
      
      // Fallback to sample data if API fails
      if (feedPosts.length === 0) {
        setFeedPosts(getSamplePosts());
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sample posts for fallback
  const getSamplePosts = () => {
    return [
      {
        _id: '1',
        content: 'This is a sample post when the API is not available.',
        userId: {
          name: userProfile.name,
          avatar: userProfile.avatar
        },
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        media: []
      }
    ];
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      if ((isImage || isVideo) && isValidSize) {
        setSelectedFile(file);
      }
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
  };

  // Fixed createPost function
  const createPost = async () => {
    if (!postText.trim() && !selectedFile) {
      alert('Please enter some content or select a file for your post');
      return;
    }

    setIsPosting(true);
    try {
      let response;

      // If no file selected, use simple JSON request
      if (!selectedFile) {
        response = await fetch(`${API_BASE_URL}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            content: postText.trim(),
            location: postLocation.trim() || undefined
          })
        });
      } else {
        // If file is selected, use FormData
        const formData = new FormData();
        formData.append('content', postText.trim());

        if (postLocation.trim()) {
          formData.append('location', postLocation.trim());
        }

        // Add file to FormData with 'image' key
        formData.append('image', selectedFile);

        response = await fetch(`${API_BASE_URL}/posts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type for FormData - browser will set it automatically
          },
          body: formData
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        handlePostCreationSuccess(data.data);
      } else {
        throw new Error(data.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert(`Failed to create post: ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  // Handle successful post creation
  const handlePostCreationSuccess = (newPost) => {
    // Ensure the new post has the correct structure
    const formattedPost = {
      ...newPost,
      userId: newPost.userId || {
        name: userProfile.name,
        avatar: userProfile.avatar
      },
      likes: newPost.likes || 0,
      comments: newPost.comments || 0,
      shares: newPost.shares || 0,
      media: newPost.media || []
    };

    // Add new post to the beginning of the feed
    setFeedPosts(prev => [formattedPost, ...prev]);

    // Clear form
    setPostText('');
    setPostLocation('');
    setSelectedFile(null);
    setIsModalOpen(false);

    // Update pagination count
    setPagination(prev => ({
      ...prev,
      totalPosts: (prev.totalPosts || 0) + 1
    }));
  };

  // Fixed handleLike function
  const handleLike = async (postId) => {
    try {
      // Optimistic UI update
      const isCurrentlyLiked = likedPosts.has(postId);
      
      setFeedPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: isCurrentlyLiked ? Math.max(0, post.likes - 1) : (post.likes + 1)
          };
        }
        return post;
      }));

      const newLiked = new Set(likedPosts);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      setLikedPosts(newLiked);

      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        // Update with actual server data
        const updatePost = (post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: data.data.likes || data.data.post?.likes || post.likes,
              likedBy: data.data.post?.likedBy || post.likedBy
            };
          }
          return post;
        };

        setFeedPosts(prev => prev.map(updatePost));
        setSavedPostsData(prev => prev.map(updatePost));

        // Update liked posts set based on server response
        if (data.data.isLiked !== undefined) {
          const serverLiked = new Set(likedPosts);
          if (data.data.isLiked) {
            serverLiked.add(postId);
          } else {
            serverLiked.delete(postId);
          }
          setLikedPosts(serverLiked);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setFeedPosts(prev => prev.map(post => {
        if (post._id === postId) {
          const wasLiked = !likedPosts.has(postId);
          return {
            ...post,
            likes: wasLiked ? Math.max(0, post.likes - 1) : (post.likes + 1)
          };
        }
        return post;
      }));

      const revertedLiked = new Set(likedPosts);
      setLikedPosts(revertedLiked);
    }
  };

  const handleSave = (postId) => {
    const post = feedPosts.find(p => p._id === postId);
    const newSaved = new Set(savedPosts);
    
    if (newSaved.has(postId)) {
      newSaved.delete(postId);
      setSavedPostsData(prev => prev.filter(p => p._id !== postId));
    } else {
      newSaved.add(postId);
      if (post) {
        setSavedPostsData(prev => [...prev, post]);
      }
    }
    setSavedPosts(newSaved);
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInHours < 1) return 'now';
      if (diffInHours < 24) return `${diffInHours}h`;
      if (diffInDays === 1) return '1 day';
      if (diffInDays < 7) return `${diffInDays} days`;
      return date.toLocaleDateString();
    } catch (error) {
      return 'recently';
    }
  };

  // Check if user has liked a post
  const isPostLikedByUser = (post) => {
    return likedPosts.has(post._id);
  };

  // Get current posts based on active tab
  const getCurrentPosts = () => {
    if (activeTab === 'Saved Posts') {
      return savedPostsData;
    }
    return feedPosts;
  };

  // Rest of your component remains the same...
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

  if (isLoading && feedPosts.length === 0) {
    return (
      <div className="bg-gray-950 min-h-screen text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error && feedPosts.length === 0) {
    return (
      <div className="bg-gray-950 min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => fetchPosts()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentPosts = getCurrentPosts();

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
      <div className="px-4 lg:px-6 py-4 border-gray-800">
        <div className="w-full mx-auto">
          <div className="flex items-center text-sm">
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Business</span>
            <span className="mx-2 text-gray-600">{'>'}</span>
            <span className="text-gray-400 font-medium">My Feed</span>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className={`
            ${isMobileMenuOpen ? 'block' : 'hidden'} 
            lg:block lg:w-80 lg:flex-shrink-0
          `}>
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Profile Card */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">
                {/* Cover Image */}
                <div className="relative h-28 lg:h-32 w-full">
                  <img
                    src={userProfile.coverImage || "/default-cover.jpg"}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  {/* Avatar */}
                  <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
                    <div className="relative">
                      <img
                        src={userProfile.avatar}
                        alt="Profile"
                        className="w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover ring-4 ring-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 pb-6 text-center">
                  <h3 className="font-bold text-xl lg:text-2xl text-white">{userProfile.name}</h3>
                  <p className="text-gray-300 text-sm lg:text-base">{userProfile.title}</p>
                  <p className="text-gray-400 text-xs lg:text-sm">{userProfile.role}</p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 mx-6"></div>

                {/* Stats */}
                <div className="grid grid-cols-2 py-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {pagination.totalPosts || feedPosts.length}
                    </div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {userProfile.connections}
                    </div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                      Connections
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-gray-900 overflow-hidden border border-gray-800 shadow-xl">
                  {['My Feeds', 'Saved Posts'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 lg:px-6 py-3 lg:py-4 text-left font-medium transition-all duration-200 flex items-center justify-between ${
                        activeTab === tab
                          ? 'text-white shadow-lg bg-gray-800'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span className="text-sm lg:text-base">{tab}</span>
                      {tab === 'Saved Posts' && (
                        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                          {savedPostsData.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Feed */}
          <div className="flex-1 min-w-0">
            <div className="space-y-4 lg:space-y-6">
              {/* Post Creation Button - Only show on My Feeds tab */}
              {activeTab === 'My Feeds' && (
                <div className="flex gap-4 bg-gray-800 p-3 rounded-3xl">
                  <img
                    src={userProfile.avatar}
                    alt="User Avatar"
                    className="w-17 h-17 rounded-full object-cover ring-2 ring-gray-700"
                  />
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gray-700 w-full h-17 rounded-4xl text-left px-4 text-gray-400 hover:text-white"
                  >
                    Share your post message
                  </button>
                </div>
              )}

              {/* Create Post Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  {/* Overlay */}
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-60"
                    onClick={() => setIsModalOpen(false)}
                  ></div>

                  {/* Dialog */}
                  <div className="relative bg-gray-900 rounded-2xl w-full max-w-2xl border border-gray-800 shadow-2xl z-10 mx-4">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                      <div className="flex items-center space-x-3">
                        <img
                          src={userProfile.avatar}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-white">{userProfile.name}</h3>
                          <p className="text-sm text-gray-400">{userProfile.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        placeholder="Share your post message"
                        rows={4}
                      />
                      
                      {/* Location Input */}
                      <div className="mt-4">
                        <input
                          type="text"
                          value={postLocation}
                          onChange={(e) => setPostLocation(e.target.value)}
                          className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Add location (optional)"
                        />
                      </div>

                      {/* File Preview */}
                      {selectedFile && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-300">Selected File:</h4>
                          <div className="relative bg-gray-800 p-3 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 min-w-0">
                                {selectedFile.type.startsWith('image/') ? (
                                  <Image className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                ) : selectedFile.type.startsWith('video/') ? (
                                  <Video className="w-4 h-4 text-red-400 flex-shrink-0" />
                                ) : (
                                  <File className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                                <span className="text-sm text-gray-300 truncate">{selectedFile.name}</span>
                              </div>
                              <button
                                onClick={() => removeFile()}
                                className="text-gray-400 hover:text-red-400 p-1 flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions Bar */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors"
                          >
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700">
                              <Image className="w-5 h-5" />
                            </div>
                            <span className="text-sm">Add Image/Video</span>
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={createPost}
                            disabled={isPosting || (!postText.trim() && !selectedFile)}
                            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isPosting ? 'Posting...' : 'Post'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feed Posts */}
              {currentPosts.length === 0 ? (
                <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800">
                  <p className="text-gray-400">
                    {activeTab === 'Saved Posts' 
                      ? 'No saved posts yet. Save posts to see them here!' 
                      : 'No posts yet. Be the first to share something!'}
                  </p>
                </div>
              ) : (
                currentPosts.map((post) => (
                  <div key={post._id} className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                    {/* Post Header */}
                    <div className="flex items-center justify-between p-4 lg:p-6 pb-3 lg:pb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.userId?.avatar || userProfile.avatar}
                          alt={post.userId?.name || 'User'}
                          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-gray-700"
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white text-sm lg:text-base truncate">
                            {post.userId?.name || userProfile.name}
                          </h4>
                          <div className="flex items-center text-gray-400 text-xs lg:text-sm space-x-1 lg:space-x-2 flex-wrap">
                            <span>{formatTimeAgo(post.createdAt)}</span>
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

                    {/* Post Media */}
                    {post.media && post.media.length > 0 && (
                      <div className="px-4 lg:px-6 pb-3 lg:pb-4">
                        {post.media.map((mediaItem, index) => {
                          // Handle both string URLs and object formats
                          const mediaUrl = typeof mediaItem === 'string' ? mediaItem : mediaItem?.url;
                          const mediaType = typeof mediaItem === 'string' ? 'image' : mediaItem?.type || 'image';

                          return (
                            <div key={index} className="mb-3">
                              {mediaType?.startsWith('image/') || mediaType === 'image' ? (
                                <img
                                  src={mediaUrl}
                                  alt="Post content"
                                  className="w-full h-auto rounded-xl object-cover border border-gray-800"
                                  onError={(e) => {
                                    console.error('Image failed to load:', mediaUrl);
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : mediaType?.startsWith('video/') || mediaType === 'video' ? (
                                <video
                                  controls
                                  className="w-full rounded-xl border border-gray-800"
                                >
                                  <source src={mediaUrl} type={mediaType} />
                                  Your browser does not support the video tag.
                                </video>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="px-4 lg:px-6 py-2 text-xs lg:text-sm text-gray-400">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <span>{post.likes || 0} likes</span>
                          <span>{post.comments || 0} comments</span>
                          {post.shares > 0 && <span>{post.shares} shares</span>}
                        </div>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="px-4 lg:px-6 py-3 lg:py-4 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 lg:space-x-1 w-full justify-between lg:justify-start">
                          <button 
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-1 lg:py-2 rounded-lg transition-all flex-1 lg:flex-none justify-center ${
                              isPostLikedByUser(post)
                                ? 'text-red-500 bg-red-500/10'
                                : 'text-gray-400 hover:text-red-500 hover:bg-gray-800'
                            }`}
                          >
                            <Heart className={`w-4 h-4 lg:w-5 lg:h-5 ${isPostLikedByUser(post) ? 'fill-current' : ''}`} />
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
                          onClick={() => handleSave(post._id)}
                          className={`p-2 rounded-lg transition-all ml-2 ${
                            savedPosts.has(post._id)
                              ? 'text-orange-500 bg-orange-500/10'
                              : 'text-gray-400 hover:text-orange-500 hover:bg-gray-800'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 lg:w-5 lg:h-5 ${savedPosts.has(post._id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Load More Button - Only show on My Feeds tab */}
              {activeTab === 'My Feeds' && pagination.hasMore && (
                <div className="text-center">
                  <button 
                    onClick={() => fetchPosts((pagination.currentPage || 1) + 1)}
                    disabled={isLoading}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2 mx-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Load More Posts</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
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
        </div>
      </div>
    </div>
  );
};

export default MyFeedComponent;
