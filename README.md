# Real-Time Typing Chat App

A beautiful, minimalist real-time chat application where users can see each other's typing character-by-character instantly. Built with Next.js 14, Socket.IO, and Tailwind CSS.

## Features

- ⚡ **Real-time typing synchronization** - See every keystroke instantly
- 🔄 **Two-way communication** - Both users can type simultaneously
- 📱 **Responsive design** - Side-by-side on desktop, stacked on mobile
- 🎨 **Beautiful UI** - Clean, modern interface with smooth animations
- 🔗 **Shareable sessions** - Generate unique session links to invite others
- 🚫 **No registration** - Start chatting immediately without accounts
- 📊 **Connection status** - Real-time indicators and user presence
- 🧹 **Ephemeral sessions** - Automatic cleanup of inactive sessions

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Real-time**: Socket.IO
- **Backend**: Node.js, Express
- **Icons**: Lucide React
- **Deployment**: Vercel (frontend), Railway (WebSocket server)

## Architecture

This app uses a **separate deployment strategy**:

- **Frontend**: Static Next.js app deployed to Vercel/Netlify
- **WebSocket Server**: Node.js server deployed to Railway

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd realtime-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the WebSocket server** (in server directory)
   ```bash
   cd server
   npm install
   npm run dev
   ```

4. **Start the Next.js development server** (in root directory)
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - WebSocket server health: http://localhost:3001/health

## Deployment

### Step 1: Deploy WebSocket Server to Railway

1. Create a new Railway project
2. Connect your GitHub repository
3. Set the **Root Directory** to `server`
4. Railway will automatically detect the Node.js app
5. Set environment variables:
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-domain.com` (optional)
6. Deploy and note the Railway URL (e.g., `https://your-app.up.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the Next.js app
4. The frontend will be deployed as a static site
5. No environment variables needed (WebSocket URL is hardcoded)

### Step 3: Update WebSocket URL (if needed)

If your Railway URL is different, update the WebSocket URL in:
`app/chat/[sessionId]/page.tsx` line 32:

```typescript
const socketUrl = 'https://your-railway-app.up.railway.app';
```

## Environment Variables

**Frontend**: No environment variables needed

**Backend (Railway)**:
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── chat/[sessionId]/  # Dynamic chat page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
├── server/               # WebSocket server (separate deployment)
│   ├── index.js          # Server implementation
│   └── package.json      # Server dependencies
└── README.md
```

## How It Works

1. **Session Creation**: Users create a unique session ID or join an existing one
2. **Real-time Connection**: Socket.IO establishes WebSocket connection to Railway server
3. **Typing Sync**: Every keystroke is immediately broadcast to connected users
4. **User Management**: Server tracks active users and their typing status
5. **Session Cleanup**: Inactive sessions are automatically cleaned up

## Troubleshooting

### Connection Issues

1. Check that the Railway WebSocket server is running
2. Verify the WebSocket URL in the frontend code
3. Check browser console for connection errors
4. Test the health endpoint: `https://your-railway-app.up.railway.app/health`

### Railway Deployment Issues

1. Ensure Root Directory is set to `server`
2. Check that `package.json` exists in the server directory
3. Verify environment variables are set correctly
4. Check Railway logs for server errors

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with WebSocket support

## Performance

- Optimized for low latency
- Efficient WebSocket message handling
- Automatic cleanup of inactive sessions
- Client-side debouncing for typing indicators

## Security

- CORS properly configured
- No data persistence (ephemeral sessions)
- Rate limiting ready for production
- Environment-based configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.