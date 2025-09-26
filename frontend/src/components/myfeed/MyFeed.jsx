import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, MessageSquare, Share, Send, MoreHorizontal, 
  Bookmark, Users, Bell, Search, Plus, Camera, Video, 
  Image, Smile, ThumbsUp, Edit3, MapPin, Calendar,
  Eye, Copy, Flag, Menu, X, Loader2, Upload, File
} from 'lucide-react';
import LeftSidebar from './LeftSidebar';
import CenterFeed from './CenterFeed';
import RightSidebar from './RightSidebar';

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

        // Debug: Log image data for posts
        posts.forEach(post => {
          if (post.image) {
            console.log('Post image:', post.image);
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
        image: null
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
          <LeftSidebar 
            userProfile={userProfile}
            pagination={pagination}
            feedPosts={feedPosts}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            savedPostsData={savedPostsData}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />

          {/* Center Feed */}
          <CenterFeed 
            activeTab={activeTab}
            userProfile={userProfile}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            postText={postText}
            setPostText={setPostText}
            postLocation={postLocation}
            setPostLocation={setPostLocation}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            removeFile={removeFile}
            createPost={createPost}
            isPosting={isPosting}
            getCurrentPosts={getCurrentPosts}
            formatTimeAgo={formatTimeAgo}
            handleLike={handleLike}
            handleSave={handleSave}
            isPostLikedByUser={isPostLikedByUser}
            savedPosts={savedPosts}
            pagination={pagination}
            fetchPosts={fetchPosts}
            isLoading={isLoading}
          />

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default MyFeedComponent;