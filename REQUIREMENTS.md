# Project Requirements

## Project Context

- Implementation will be done in the Redelivery project
- Tech Stack: Next.js with SSR

## Open Questions & Technical Decisions

- Meeting needed with Calls Team to understand available API functionality
- Storage decisions:
  - Call metadata and history in Experts API
  - Transcript storage location to be discussed

## System Architecture

### Components Flow

1. Redelivery (Frontend Next.js)

   - Real-time call status display
   - WebSocket connection for real-time updates
   - Feature flag management ("Recorded_and_Transcribed_Vetting_Calls")
   - Cross-page state management
   - Error handling and user feedback
   - Drag and drop functionality
   - Manual recording control with confirmation
   - Transcription history view in side panel

2. Redelivery SSR

   - Handles frontend data requests
   - Connects to Experts API
   - WebSocket proxy for real-time data
   - Cross-tab state synchronization

3. Experts API

   - WebSocket support layer
   - Persists call metadata and history
   - Stores transcription content (location TBD)
   - Proxies real-time data from Calls Team API
   - Queries internal API for expert consent
   - Handles manual stop requests

4. Calls Team API (External Service)
   - Source of real-time call data
   - Handles actual calls
   - Manages recordings
   - Provides transcription service
   - Emits real-time events

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

### UI Components

1. Call Status Bar

   - Black bar design
   - Shows expert name
   - Displays call duration timer
   - Grab handle icon appears on hover
   - Draggable functionality
   - Visible across all Delivery pages
   - Position persists during navigation

2. Transcript Button

   - Located above Career History Side Panel
   - Only visible after call is transcribed
   - Opens transcript side panel

3. Transcript Side Panel
   - List of past recordings
   - Search functionality
   - Chronological organization
   - Dropdown for transcript selection
   - Labels: "{Month Day, Year, Time Stamp}"
   - Speaker identification:
     - CST: name and face above quotes
     - Expert: name and icon above quotes
   - Timestamp for each quote
   - Transcript merging rules:
     - < 60 minutes: append with divider
     - > 60 minutes: new transcript entry

### Error Notifications (Toast Messages)

- Failed to start recording
- Expert has not consented to being recorded
- Displayed separately from main widget

### Cross-page Behavior

- Status bar visible across all Delivery pages
- State persistence between page navigation
- New tab synchronization
- Position memory for draggable bar
- "Back to Expert" navigation when not on expert page
- Modal persists across pages until action taken

### Data Persistence (Experts API)

- Call metadata (including termination reason)
- Call history data
- Expert information related to calls
- Error logs
- Stop reason tracking
- Transcription metadata
- Timestamp information
- Transcription content (storage location TBD)

## Notes

- Frontend implementation will be done with mock data initially
- Integration points will be clearly marked for future API implementation
- Real-time data comes from Calls Team API, proxied through Experts API
- Expert consent verified through internal API query
- Error states shown via toast messages
- Cross-page functionality requires robust state management
- Confirmation required before ending recording
- No PTO data storage needed for this feature
