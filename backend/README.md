# Video Streaming Backend

Express.js backend server for video streaming application with FFmpeg integration.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
# or for development
npm run dev
```

3. Server will be running on http://localhost:5000

## API Documentation

### Upload Video
**POST** `/api/upload`
- Accepts multipart/form-data with video file
- Converts to HLS format using FFmpeg
- Returns video metadata

### Get Videos
**GET** `/api/videos?page=1&limit=10`
- Returns paginated list of videos
- Supports pagination parameters

### Get Single Video
**GET** `/api/videos/:id`
- Returns specific video details
- Increments view count

### Delete Video
**DELETE** `/api/videos/:id`
- Removes video and associated files

### Health Check
**GET** `/api/health`
- Server status check

## Features

- Video upload with validation
- FFmpeg HLS conversion
- File management and cleanup
- RESTful API design
- Error handling
- CORS support
