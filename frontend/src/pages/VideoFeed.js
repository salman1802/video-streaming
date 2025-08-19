import React, { useState, useEffect, useCallback } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { videoAPI } from '../services/api';
import './VideoFeed.css';

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false
  });

  const loadVideos = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      
      setError(null);
      const response = await videoAPI.getVideos(page, 10);
      
      if (append) {
        setVideos(prev => [...prev, ...response.videos]);
      } else {
        setVideos(response.videos);
      }
      
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const loadMoreVideos = () => {
    if (pagination.hasNext && !loadingMore) {
      loadVideos(pagination.currentPage + 1, true);
    }
  };

  const handleRefresh = () => {
    loadVideos(1, false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const formatViews = (views) => {
    if (views < 1000) return views.toString();
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`;
    return `${(views / 1000000).toFixed(1)}M`;
  };

  if (loading && videos.length === 0) {
    return (
      <div className="feed-container">
        <div className="loading-state">
          <div className="loading"></div>
          <p>Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="feed-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Failed to load videos</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="btn retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>Video Feed</h1>
        <button onClick={handleRefresh} className="refresh-btn" disabled={loading}>
          🔄
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📹</div>
          <h3>No videos yet</h3>
          <p>Be the first to upload a video!</p>
          <a href="/upload" className="btn">
            Upload Video
          </a>
        </div>
      ) : (
        <>
          <div className="video-feed">
            {videos.map((video) => (
              <div key={video.id} className="video-post">
                <div className="post-header">
                  <div className="user-info">
                    <div className="avatar">👤</div>
                    <div className="user-details">
                      <h4>User</h4>
                      <span className="post-time">{formatDate(video.uploadDate)}</span>
                    </div>
                  </div>
                  <div className="post-menu">⋯</div>
                </div>

                <div className="video-content">
                  <VideoPlayer
                    src={videoAPI.getVideoStreamUrl(video.hlsPath)}
                    className="feed-video"
                  />
                </div>

                <div className="post-actions">
                  <div className="action-buttons">
                    <button className="action-btn like-btn">
                      <span className="icon">❤️</span>
                      <span>Like</span>
                    </button>
                    <button className="action-btn comment-btn">
                      <span className="icon">💬</span>
                      <span>Comment</span>
                    </button>
                    <button className="action-btn share-btn">
                      <span className="icon">📤</span>
                      <span>Share</span>
                    </button>
                  </div>
                  <div className="save-btn">
                    <button className="action-btn">
                      <span className="icon">🔖</span>
                    </button>
                  </div>
                </div>

                <div className="post-info">
                  <div className="view-count">
                    {formatViews(video.views)} views
                  </div>
                  <div className="post-content">
                    <h3 className="video-title">{video.title}</h3>
                    {video.description && (
                      <p className="video-description">{video.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.hasNext && (
            <div className="load-more-container">
              <button 
                onClick={loadMoreVideos} 
                className="btn load-more-btn"
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More Videos'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoFeed;
