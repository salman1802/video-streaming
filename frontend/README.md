# Video Streaming Frontend

React frontend for video streaming application with HLS video player and Instagram-like feed.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open http://localhost:3000 in your browser

## Features

- **Video Upload**: Drag & drop interface with progress tracking
- **HLS Player**: Adaptive streaming with hls.js
- **Feed Interface**: Instagram-like video browsing
- **Responsive Design**: Works on desktop and mobile
- **React Router**: Client-side navigation

## Components

### VideoPlayer
- HLS video streaming with hls.js
- Cross-browser compatibility
- Loading and error states
- Responsive design

### VideoFeed
- Instagram-like feed layout
- Pagination support
- Infinite scroll
- Video metadata display

### Upload
- Drag & drop file upload
- File validation
- Upload progress tracking
- Video preview

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.
