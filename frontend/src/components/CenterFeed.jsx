import React from 'react';
import { 
  Heart, MessageSquare, Share, Send, MoreHorizontal, 
  Bookmark, Users, Bell, Search, Plus, Camera, Video, 
  Image, Smile, ThumbsUp, Edit3, MapPin, Calendar,
  Eye, Copy, Flag, Menu, X, Loader2, Upload, File
} from 'lucide-react';

const CenterFeed = ({
  activeTab,
  userProfile,
  isModalOpen,
  setIsModalOpen,
  postText,
  setPostText,
  postLocation,
  setPostLocation,
  selectedFile,
  setSelectedFile,
  fileInputRef,
  handleFileSelect,
  removeFile,
  createPost,
  isPosting,
  getCurrentPosts,
  formatTimeAgo,
  handleLike,
  handleSave,
  isPostLikedByUser,
  savedPosts,
  pagination,
  fetchPosts,
  isLoading
}) => {
  const currentPosts = getCurrentPosts();

  return (
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

              {/* Post Image - Instagram Style */}
              {post.image && (
                <div className="w-full">
                  <img
                    src={`http://localhost:5000${post.image}`}
                    alt="Post content"
                    className="w-full h-auto max-h-96 object-cover"
                  />
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
  );
};

export default CenterFeed;