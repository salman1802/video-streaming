import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for video uploads
});

// Video API functions
export const videoAPI = {
  // Upload a video
  uploadVideo: async (formData, onProgress) => {
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Failed to upload video'
      );
    }
  },

  // Get videos with pagination
  getVideos: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/videos', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Failed to fetch videos'
      );
    }
  },

  // Get single video
  getVideo: async (id) => {
    try {
      const response = await api.get(`/videos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Failed to fetch video'
      );
    }
  },

  // Delete video
  deleteVideo: async (id) => {
    try {
      const response = await api.delete(`/videos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Failed to delete video'
      );
    }
  },

  // Get video stream URL
  getVideoStreamUrl: (hlsPath) => {
    return `${API_BASE_URL.replace('/api', '')}${hlsPath}`;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Server is not responding');
  }
};

export default api;
