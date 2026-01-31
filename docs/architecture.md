# Architecture

## System Overview

Health Journal is a privacy-first web application for tracking mood, energy, and food intake with AI assistance. The application uses a client-server architecture with all user data stored locally in browser localStorage.

### Technology Stack

**Frontend:**
- React 18 - UI library
- Vite - Build tool and dev server
- React Router 6 - Client-side routing
- date-fns - Date manipulation
- uuid - Unique ID generation

**Backend:**
- Express - Web framework
- @anthropic-ai/sdk - Claude API client
- cors - CORS middleware
- express-rate-limit - Rate limiting
- dotenv - Environment variables

## Frontend Architecture

### Component Hierarchy

```
App
├── Router (react-router-dom)
├── JournalProvider (wraps entire app)
│   ├── ChatProvider
│   │   ├── Landing Page
│   │   ├── Dashboard
│   │   ├── DailyCheckIn
│   │   │   ├── MoodSelector
│   │   │   ├── EnergySelector
│   │   │   └── FoodEntryForm
│   │   ├── Review (Phase 4)
│   │   └── Export (Phase 5)
│   └── FloatingChatButton
│       └── ChatWindow
```

### Directory Structure

```
client/src/
├── components/
│   ├── common/          # Reusable UI primitives
│   │   ├── Button.jsx & .css
│   │   ├── Card.jsx & .css
│   │   └── Input.jsx & .css
│   ├── journal/         # Journal-specific components
│   │   ├── MoodSelector.jsx & .css
│   │   ├── EnergySelector.jsx & .css
│   │   └── FoodEntryForm.jsx & .css
│   └── chatbot/         # Chat-related components
│       ├── ChatWindow.jsx & .css
│       └── FloatingChatButton.jsx & .css
├── pages/               # Route components
│   ├── Landing.jsx & .css
│   ├── Dashboard.jsx & .css
│   ├── DailyCheckIn.jsx & .css
│   ├── Review.jsx & .css
│   └── Export.jsx & .css
├── context/             # React Context providers
│   ├── JournalContext.jsx
│   └── ChatContext.jsx
├── services/            # Business logic layer
│   ├── storageService.js
│   └── chatService.js
├── hooks/               # Custom React hooks
│   └── useLocalStorage.js
├── utils/               # Constants and helpers
│   ├── constants.js
│   └── dateUtils.js
├── styles/              # Global styles
│   ├── theme.js
│   └── globals.css
├── App.jsx
└── main.jsx
```

### Data Flow Pattern

All state management follows this unidirectional flow:

```
User Action
    ↓
Component (UI)
    ↓
Context Provider (state management)
    ↓
Service Layer (business logic)
    ↓
localStorage / API
    ↓
Context Provider (reload data)
    ↓
Component (re-render with new state)
```

### Context Pattern

Both JournalContext and ChatContext follow the same pattern:

1. **Initialization**: Load data from service on component mount
2. **State Exposure**: Provide state and mutation methods to children via context
3. **Mutation**: Call service methods to persist changes
4. **Reload**: Refresh state after mutations to keep UI in sync

Example from JournalContext:
```javascript
const addCheckIn = (entryId, checkInData) => {
  storageService.addCheckIn(entryId, checkInData);
  loadJournalData(); // Reload to sync state
};
```

### Service Layer

Services are singleton classes that encapsulate business logic and external interactions.

**storageService.js**: Single source of truth for all localStorage operations
- `createConfig(duration)` - Initialize new journal
- `getConfig()` - Retrieve configuration
- `getEntries()` - Retrieve all entries
- `addCheckIn(entryId, checkInData)` - Add check-in to entry
- `addFoodEntry(entryId, foodData)` - Add food entry
- `updateCheckIn()`, `deleteCheckIn()`, etc.

**chatService.js**: Frontend API client for chat endpoints
- `sendMessage(message, journalContext)` - Standard chat
- `streamMessage(message, journalContext, onChunk)` - SSE streaming

## Backend Architecture

### Server Structure

```
server/src/
├── routes/
│   └── chat.js          # Chat endpoint routes
├── services/
│   └── claudeService.js # Anthropic API integration
└── server.js            # Express app configuration
```

### Middleware Stack

1. **CORS** - Restricts API access to configured CLIENT_URL
2. **Rate Limiting** - 100 requests per 15 minutes per IP
3. **JSON Parser** - Parses request bodies
4. **Routes** - Application endpoints
5. **Error Handler** - Catches and formats errors

### API Endpoints

**POST /api/chat**
```javascript
Request: {
  message: "string",
  journalContext: {
    currentDay: 1,
    totalDays: 5,
    completedCheckIns: ["WAKING", "AFTER_FAST"],
    pendingCheckIns: ["NOON", "AFTER_DINNER", "BEDTIME"],
    completionPercentage: 20
  }
}

Response: {
  success: true,
  message: "string",
  usage: { inputTokens: 100, outputTokens: 50 }
}
```

**POST /api/chat/stream**
- Same request format
- Returns Server-Sent Events (SSE) stream
- Client receives chunks progressively

**GET /api/health**
```javascript
Response: {
  status: 'ok',
  timestamp: '2024-01-31T12:00:00.000Z'
}
```

### Claude Integration

The claudeService wraps the Anthropic SDK with application-specific logic:

- Model: claude-3-5-sonnet-20241022
- System prompt defines "cheerful health journal assistant" persona
- Responses limited to 2–3 paragraphs max
- Never provides medical advice
- Optional journal context provides completion status for contextual responses

## Data Model

### Storage Schema

**healthJournal_config**
```javascript
{
  journalId: "uuid",
  userId: "uuid",
  duration: 5,
  startDate: "2024-01-31",
  createdAt: "2024-01-31T12:00:00.000Z"
}
```

**healthJournal_entries**
```javascript
[
  {
    entryId: "uuid",
    journalId: "uuid",
    dayNumber: 1,
    date: "2024-01-31",
    checkIns: [
      {
        checkInId: "uuid",
        timeSlot: "WAKING",
        timestamp: "2024-01-31T07:00:00.000Z",
        mood: {
          descriptors: ["happy", "energetic"],
          score: 4
        },
        energy: {
          score: 3
        }
      },
      // ... more check-ins
    ],
    foodEntries: [
      {
        foodId: "uuid",
        timestamp: "2024-01-31T08:00:00.000Z",
        type: "breakfast",
        foods: ["oatmeal", "banana", "coffee"],
        notes: "Felt good after eating"
      },
      // ... more food entries
    ]
  },
  // ... more entries
]
```

**healthJournal_chatHistory**
```javascript
[
  {
    role: "user",
    content: "How am I doing?",
    timestamp: "2024-01-31T12:00:00.000Z"
  },
  {
    role: "assistant",
    content: "You're making great progress!",
    timestamp: "2024-01-31T12:00:01.000Z"
  }
]
```

### Time Slots System

Defined in constants.js, each time slot specifies what to track:

```javascript
TIME_SLOTS = [
  {
    id: 'WAKING',
    label: 'Upon Waking',
    tracks: ['mood', 'energy'],
    description: 'How do you feel when you wake up?'
  },
  {
    id: 'AFTER_FAST',
    label: 'After Breaking Fast',
    tracks: ['mood', 'energy', 'food'],
    description: 'Your first meal of the day'
  },
  // ... more slots
]
```

Components use `tracks` array to determine which inputs to render.

## Routing

React Router v6 configuration:

- `/` - Landing page (journal creation)
- `/dashboard` - Overview of all days with calendar
- `/day/:dayNumber` - Daily check-in page
- `/review` - Visualizations (Phase 4)
- `/export` - PDF/Excel export (Phase 5)

## State Management

### JournalContext

Manages journal configuration and entries.

**State:**
- `config` - Journal configuration
- `entries` - All daily entries
- `loading` - Loading state

**Methods:**
- `createJournal(duration)` - Initialize new journal
- `addCheckIn(entryId, checkInData)` - Add check-in
- `updateCheckIn(checkInId, updates)` - Update check-in
- `deleteCheckIn(checkInId)` - Delete check-in
- `addFoodEntry(entryId, foodData)` - Add food entry
- `getEntryByDayNumber(dayNumber)` - Retrieve specific entry
- `getJournalProgress()` - Calculate completion percentage

### ChatContext

Manages chatbot state and message history.

**State:**
- `messages` - Chat message array
- `isOpen` - Chat window visibility
- `isLoading` - Message sending state

**Methods:**
- `sendMessage(content)` - Send message to Claude
- `toggleChat()` - Open/close chat window
- `clearHistory()` - Clear chat messages

## Security

### Frontend Security
- No sensitive data in localStorage (only journal entries)
- All API calls use relative URLs protected by CORS
- Input validation on all forms
- XSS prevention via React's default escaping

### Backend Security
- API key stored server-side only (.env file)
- Rate limiting prevents API abuse
- CORS restricts access to configured client URL
- Input validation and sanitization
- Error messages never leak sensitive information

## Performance Considerations

### Frontend
- Components use React.memo to prevent unnecessary re-renders
- Context providers minimize re-render scope
- localStorage reads are batched where possible
- Service layer caches frequently accessed data

### Backend
- Rate limiting protects against abuse
- Claude responses are kept concise to reduce latency
- Error handling is efficient and doesn't block

## Development Workflow

### Adding New Check-in Field

1. Update TIME_SLOTS in constants.js to specify which slots track it
2. Add field to check-in data model in storageService.js
3. Create component in client/src/components/journal/
4. Update DailyCheckIn.jsx to conditionally render based on tracks array
5. Update CSS for mobile responsiveness

### Adding New API Endpoint

1. Create route file in server/src/routes/
2. Register route in server.js
3. Create/update service in server/src/services/ if needed
4. Add corresponding method to client/src/services/
5. Update context if needed for state management

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Mobile Chrome (Android 10+)

## Future Architecture Considerations

- Phase 4: Add charting library (Recharts)
- Phase 5: Add export libraries (jsPDF, xlsx)
- Phase 6: Code splitting and lazy loading
- Phase 7: Production deployment configuration
