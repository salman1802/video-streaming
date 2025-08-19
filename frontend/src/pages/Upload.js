import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoAPI } from '../services/api';
import './Upload.css';

const Upload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid video file (MP4, AVI, MOV, WMV, WebM)');
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 100MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      video: file,
      title: prev.title || file.name.replace(/\.[^/.]+$/, '') // Set title to filename if empty
    }));

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.video) {
      alert('Please select a video file');
      return;
    }

    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadData = new FormData();
      uploadData.append('video', formData.video);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);

      await videoAPI.uploadVideo(uploadData, setUploadProgress);
      
      // Success
      alert('Video uploaded successfully!');
      navigate('/');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, video: null }));
    setPreview(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div className="upload-page">
      <div className="container">
        <div className="upload-header">
          <h1>Upload Video</h1>
          <p>Share your video with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* File Upload Area */}
          <div 
            className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${formData.video ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !formData.video && document.getElementById('fileInput').click()}
          >
            {formData.video ? (
              <div className="file-preview">
                {preview && (
                  <video
                    src={preview}
                    controls
                    className="video-preview"
                    preload="metadata"
                  />
                )}
                <div className="file-info">
                  <h3>{formData.video.name}</h3>
                  <p>{(formData.video.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <button 
                    type="button" 
                    onClick={removeFile}
                    className="remove-file-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📁</div>
                <h3>Drop your video here</h3>
                <p>or click to browse</p>
                <p className="file-types">Supports: MP4, AVI, MOV, WMV, WebM (max 100MB)</p>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Form Fields */}
          <div className="form-fields">
            <div className="field-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter video title"
                required
                maxLength={100}
              />
            </div>

            <div className="field-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter video description (optional)"
                rows={4}
                maxLength={500}
              />
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>Uploading: {uploadProgress}%</p>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn upload-btn"
            disabled={uploading || !formData.video}
          >
            {uploading ? 'Processing...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
