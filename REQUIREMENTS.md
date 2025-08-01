# Project Requirements

## Project Context

- Implementation will be done in the Redelivery project
- Tech Stack: Next.js with SSR
- Components should be compatible with SSR architecture

## Open Questions & Technical Decisions

- Meeting needed with Calls Team to understand:
  - Available API functionality
  - Integration points
  - Real-time capabilities
- Storage architecture decisions pending:
  - Call metadata and history confirmed for Experts API
  - Transcript storage location to be discussed (might be moved to different service)

## System Architecture

### Components Flow

1. Redelivery (Frontend Next.js)

   - User interface
   - Real-time call status display
   - Connects to Redelivery SSR for data
   - WebSocket connection for real-time updates
   - Feature flag management
   - Cross-page state management
   - Error handling and user feedback
   - Drag and drop functionality
   - Manual recording control with confirmation
   - Transcription history view in side panel
   - Cross-page navigation handling

2. Redelivery SSR

   - Handles frontend data requests
   - Connects to Experts API
   - WebSocket proxy for real-time data
   - Cross-tab state synchronization

3. Experts API

   - Domain-specific backend
   - WebSocket support layer
   - Persists call metadata and history
   - Stores transcription content (location TBD)
   - Proxies real-time data from Calls Team API
   - Queries internal API for expert recording consent
   - No direct real-time data generation
   - Error reporting and handling
   - Handles manual stop requests
   - Manages transcription storage and retrieval

4. Calls Team API (External Service)
   - Source of real-time call data
   - Handles actual calls
   - Manages recordings
   - Provides transcription service
   - Emits real-time events (call status, etc)
   - Processes manual stop commands

### Call Flow States

1. Call Initiation

   - Can be initiated by either CST or Expert
   - Recording starts automatically when call detected
   - Based on CST and Expert IDs

2. Call Termination Scenarios
   - CST hangs up
   - Expert hangs up
   - CST manually ends recording
   - Call interrupted by technical issues

### Real-time Data Flow

- Calls Team API → Experts API → Redelivery SSR → Frontend
- WebSocket connections maintained through the chain
- Experts API acts as proxy/middleware for real-time data
- Expert consent verified via simple API query
- Real-time events include:
  - Call status updates
  - Recording status changes
  - Transcription progress
  - Manual stop events
  - Call termination events

### Call Status Widget States

1. Starting Recording

   - Triggered automatically when call detected
   - Based on CST and Expert IDs
   - Initial loading state

2. Recording Live

   - Active call in progress
   - Shows call duration
   - Displays expert name
   - Manual stop option available

3. Transcribing Call
   - After call ends (any termination scenario)
   - Shows transcription progress
   - Maintains expert context

### Transcription Side Panel

- Access
  - Available within expert page
  - Opened via "View Transcript" button
  - Shows transcription history for current expert
- Single View Features
  - List of past call recordings
  - Search functionality for past calls
  - Chronological organization
  - Call metadata display (date, duration, etc)
  - Selected call transcription content
  - Timestamp information
  - Speaker identification

### Error Notifications (Toast Messages)

- Failed to start recording
- Expert has not consented to being recorded
- Displayed separately from main widget
- Non-blocking notifications

### Cross-page Behavior

- Status bar visible across all Delivery pages
- State persistence between page navigation
- New tab synchronization
- Position memory for draggable bar
- "Back to Expert" navigation:
  - Button visible when not on expert page
  - Maintains expert context across navigation
  - Direct link back to specific expert page
  - Available from any Redelivery page
- Modal persists across pages until action taken

### Data Persistence (Experts API)

- Call metadata (including termination reason)
- Call history data
- Expert information related to calls
- No real-time data persistence needed
- Error logs
- Stop reason tracking
- Transcription metadata
- Timestamp information
- Transcription content (storage location TBD)

## Notes

- Frontend implementation will be done with mock data initially
- Integration points will be clearly marked for future API implementation
- Real-time data comes from Calls Team API, proxied through Experts API
- Data persistence handled by Experts API
- Expert consent verified through internal API query
- Error states shown via toast messages
- Cross-page functionality requires robust state management
- Navigation maintains expert context across all pages
- Confirmation required before ending recording
- Transcription history available per expert
- Calls can be initiated by either CST or Expert
- No PTO data storage needed for this feature
