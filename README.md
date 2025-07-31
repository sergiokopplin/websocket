# Call Detection System - Next.js

A real-time call detection system built with Next.js, WebSocket and TypeScript.

## 🚀 Features

- **Real-time WebSocket**: Bidirectional connection for instant synchronization
- **Draggable Status Bar**: Floating interface that appears on all pages
- **Multi-tab Synchronization**: Shared state between multiple browser tabs
- **Automatic Reconnection**: Automatic recovery in case of disconnection
- **Feature Flags**: Feature control via toggle
- **TypeScript**: Complete typing for better development experience
- **Input Validation**: Robust input data validation
- **Error Handling**: Comprehensive error system

## 🛠️ Technologies

- **Frontend**: Next.js 15.4.5, React 19.1.0, TypeScript
- **Backend**: Express.js, WebSocket (ws)
- **Styling**: Tailwind CSS
- **State**: Context API + WebSocket

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd websocket

# Install dependencies
npm install

# Run in development mode
npm run dev
```

The server will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
websocket/
├── components/
│   ├── CallProvider.tsx      # Context API for global state
│   └── CallStatusBar.tsx     # Draggable status bar
├── hooks/
│   └── useWebSocket.ts       # Custom WebSocket hook
├── pages/
│   ├── _app.tsx             # Next.js configuration
│   ├── index.tsx            # Main page
│   └── another-page.tsx     # Demo page
├── server.js                # Express + WebSocket server
└── package.json
```

## 🔧 API Endpoints

### POST `/api/call/start`
Starts a new call.

**Request Body:**
```json
{
  "expertName": "Dr. Mary Santos"
}
```

**Response:**
```json
{
  "success": true,
  "call": {
    "callId": "call_1234567890_abc123",
    "expertName": "Dr. Mary Santos",
    "startTime": "2024-01-01T12:00:00.000Z",
    "status": "recording"
  }
}
```

### POST `/api/call/end`
Ends the active call.

**Response:**
```json
{
  "success": true
}
```

### GET `/api/call/status`
Returns the current call status.

**Response:**
```json
{
  "success": true,
  "hasActiveCall": true,
  "callInfo": {
    "callId": "call_1234567890_abc123",
    "expertName": "Dr. Mary Santos",
    "startTime": "2024-01-01T12:00:00.000Z",
    "status": "recording"
  }
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "activeConnections": 3,
  "hasActiveCall": true
}
```

## 🔌 WebSocket

### Connection
```
ws://localhost:3000/api/ws
```

### Messages Sent by Server

#### CALL_STARTED
```json
{
  "type": "CALL_STARTED",
  "callId": "call_1234567890_abc123",
  "expertName": "Dr. Mary Santos",
  "startTime": "2024-01-01T12:00:00.000Z",
  "status": "recording"
}
```

#### CALL_STATUS_UPDATE
```json
{
  "type": "CALL_STATUS_UPDATE",
  "updates": {
    "status": "transcribing"
  }
}
```

#### CALL_ENDED
```json
{
  "type": "CALL_ENDED",
  "callId": "call_1234567890_abc123"
}
```

#### CURRENT_CALL_STATE
```json
{
  "type": "CURRENT_CALL_STATE",
  "hasActiveCall": true,
  "callInfo": {
    "callId": "call_1234567890_abc123",
    "expertName": "Dr. Mary Santos",
    "startTime": "2024-01-01T12:00:00.000Z",
    "status": "recording"
  }
}
```

### Messages Sent by Client

#### GET_CURRENT_STATE
```json
{
  "type": "GET_CURRENT_STATE"
}
```

#### STOP_RECORDING
```json
{
  "type": "STOP_RECORDING",
  "callId": "call_1234567890_abc123"
}
```

## 🎯 How to Use

1. **Start the Server**
   ```bash
   npm run dev
   ```

2. **Access the Application**
   - Open `http://localhost:3000`
   - Check if WebSocket is connected (green indicator)

3. **Simulate a Call**
   - Click "Start Call" to start a call
   - The status bar will appear at the top of the screen
   - Drag the bar to reposition it

4. **Test Multi-tab**
   - Open multiple tabs
   - Navigate between pages
   - State will be synchronized automatically

5. **End the Call**
   - Use "Stop Recording" in the bar or "End Call" on the page
   - The call will be ended in all tabs

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start in production
npm start
```

### Type Structure

```typescript
interface Call {
  callId: string;
  expertName: string;
  startTime: Date;
  status: "recording" | "transcribing" | "completed";
}

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}
```

### Validations

- **Expert Name**: Must be a non-empty string
- **Call Status**: Only a valid status can be set
- **WebSocket**: Automatic reconnection in case of failure

## 🚀 Deploy

### Environment Variables

```env
NODE_ENV=production
PORT=3000
```

### Build for Production

```bash
npm run build
npm start
```

## 🧪 Tests

To run tests (when implemented):

```bash
npm test
```

## 📝 Future Improvements

- [ ] Authentication system
- [ ] Redis/Database persistence
- [ ] Automated tests
- [ ] Accessibility improvements
- [ ] Mobile responsiveness
- [ ] Monitoring and logs
- [ ] Rate limiting
- [ ] Message compression

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the `LICENSE` file for more details.

## 🆘 Support

If you encounter any issues or have questions, open an issue in the repository.
