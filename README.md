# Video Streaming Application

A modern video streaming application built with Node.js/Express backend and React frontend, featuring HLS (HTTP Live Streaming) video chunking and an Instagram-like feed interface.

## Features

### Backend Features
- ✅ Video upload with chunking using ffmpeg
- ✅ HLS (HTTP Live Streaming) conversion
- ✅ RESTful API with pagination
- ✅ Video metadata management
- ✅ File validation and size limits
- ✅ Automatic cleanup of processed files

### Frontend Features
- ✅ Modern React interface with routing
- ✅ Drag & drop video upload
- ✅ HLS video player with hls.js
- ✅ Instagram-like video feed
- ✅ Responsive design
- ✅ Real-time upload progress
- ✅ Video preview and metadata

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **FFmpeg** - Video processing and HLS conversion
- **fluent-ffmpeg** - Node.js FFmpeg wrapper
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **HLS.js** - HLS video streaming
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients and animations

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v14 or higher)
2. **npm** or **yarn**
3. **FFmpeg** installed on your system

### Installing FFmpeg

**Windows:**
```bash
# Using chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

**macOS:**
```bash
# Using homebrew
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

## Installation & Setup

### 1. Clone or Setup Project
```bash
# If cloning
git clone <repository-url>
cd video-streaming

# If already in project directory
# You're ready to go!
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### 1. Start Backend Server
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```
The backend will run on http://localhost:5000

### 2. Start Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000

## API Endpoints

### Video Upload
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- video: File (required)
- title: String (required)
- description: String (optional)
```

### Get Videos (with pagination)
```
GET /api/videos?page=1&limit=10

Response:
{
  "videos": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalVideos": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Single Video
```
GET /api/videos/:id
```

### Delete Video
```
DELETE /api/videos/:id
```

### Health Check
```
GET /api/health
```

## File Structure

```
video-streaming/
├── backend/
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── uploads/               # Temporary upload directory
│   └── public/
│       └── videos/            # Processed HLS video files
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── VideoPlayer.js  # HLS video player component
    │   │   ├── VideoPlayer.css
    │   │   ├── Navigation.js   # Navigation component
    │   │   └── Navigation.css
    │   ├── pages/
    │   │   ├── VideoFeed.js    # Instagram-like feed
    │   │   ├── VideoFeed.css
    │   │   ├── Upload.js       # Video upload page
    │   │   └── Upload.css
    │   ├── services/
    │   │   └── api.js          # API service functions
    │   ├── App.js              # Main app component
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## How It Works

### Video Processing Pipeline

1. **Upload**: User selects/drops video file on frontend
2. **Validation**: File type and size validation (100MB limit)
3. **Transfer**: File uploaded to backend via multipart/form-data
4. **Processing**: FFmpeg converts video to HLS format with these settings:
   ```bash
   ffmpeg -i input.mp4 -codec:v libx264 -codec:a aac -hls_time 10 -hls_list_size 0 -f hls -start_number 0 index.m3u8
   ```
5. **Storage**: HLS segments and playlist stored in `/public/videos/{videoId}/`
6. **Cleanup**: Original uploaded file is removed
7. **Response**: Video metadata returned to frontend

### HLS Streaming

- Videos are converted to HLS format for adaptive streaming
- Each video gets its own directory with `.m3u8` playlist and `.ts` segments
- Frontend uses hls.js for cross-browser HLS support
- 10-second segments provide good balance between quality and loading speed

### Frontend Architecture

- **React Router** for navigation between feed and upload pages
- **Component-based** architecture with reusable video player
- **Responsive design** that works on desktop and mobile
- **Progressive enhancement** with loading states and error handling

## Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
```

## Production Deployment

### Backend
1. Set NODE_ENV=production
2. Use process manager like PM2
3. Set up reverse proxy (nginx)
4. Configure proper file permissions
5. Set up SSL certificates

### Frontend
1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve static files via nginx or host on CDN
3. Update API_BASE_URL for production backend

## Troubleshooting

### Common Issues

**FFmpeg not found:**
- Ensure FFmpeg is installed and in system PATH
- Restart terminal/IDE after installation

**CORS errors:**
- Backend includes CORS middleware for development
- For production, configure allowed origins

**Large file uploads:**
- Increase server timeout settings
- Check disk space for video processing

**Video playback issues:**
- Ensure HLS files are accessible via HTTP
- Check browser console for hls.js errors
- Verify video codec compatibility

## Future Enhancements

- User authentication and profiles
- Video thumbnails generation
- Like/comment functionality
- Video categories and search
- Real-time notifications
- Video analytics and insights
- Multiple quality options
- Video compression optimization

## License

MIT License - feel free to use this project as a starting point for your own video streaming application!
