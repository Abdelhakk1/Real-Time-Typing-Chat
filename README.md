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
- **Deployment**: Vercel (frontend), Render/Railway (backend)

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

3. **Start the WebSocket server**
   ```bash
   npm run server:dev
   ```

4. **Start the Next.js development server** (in a new terminal)
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - WebSocket server health: http://localhost:3001/health

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_SOCKET_URL`: Your deployed WebSocket server URL
4. Deploy

### WebSocket Server (Render/Railway)

#### Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Set environment variables:
   - `FRONTEND_URL`: Your deployed frontend URL
6. Deploy

#### Railway
1. Create a new project on Railway
2. Connect your GitHub repository
3. Set root directory to `server`
4. Set environment variables:
   - `FRONTEND_URL`: Your deployed frontend URL
5. Deploy

### Environment Variables

**Frontend (.env.local)**
```
NEXT_PUBLIC_SOCKET_URL=https://your-websocket-server.onrender.com
```

**Backend (Server)**
```
FRONTEND_URL=https://your-frontend.vercel.app
PORT=3001
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
├── server/               # WebSocket server
│   ├── index.js          # Server implementation
│   └── package.json      # Server dependencies
└── README.md
```

## How It Works

1. **Session Creation**: Users create a unique session ID or join an existing one
2. **Real-time Connection**: Socket.IO establishes WebSocket connection between users
3. **Typing Sync**: Every keystroke is immediately broadcast to connected users
4. **User Management**: Server tracks active users and their typing status
5. **Session Cleanup**: Inactive sessions are automatically cleaned up

## Key Features Explained

### Real-time Typing
- Each character typed is instantly sent via WebSocket
- No send button required - everything happens live
- Both users can type simultaneously without conflicts

### Session Management
- Unique session IDs generated using nanoid
- Multiple users can join the same session
- Sessions are ephemeral and cleanup automatically

### Responsive Design
- Desktop: Side-by-side text areas
- Mobile: Stacked layout for better usability
- Touch-friendly interface on all devices

### Connection Status
- Real-time connection indicators
- User presence and typing status
- Graceful handling of disconnections

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

## Support

For questions or issues, please open a GitHub issue or contact [your-email].