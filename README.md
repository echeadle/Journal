# Health Journal Web Application 🌟

A cheerful, web-based health journal app that tracks mood, energy, and food over a configurable period. Features an AI chatbot assistant powered by Claude and exports professional reports for healthcare providers.

## Features

- **Mood Tracking**: Record how you feel throughout the day with visual selectors
- **Energy Monitoring**: Track energy levels and identify patterns
- **Food Logging**: Keep track of meals and fasting periods
- **AI Assistant**: Get help from a cheerful Claude-powered chatbot
- **Professional Reports**: Generate PDF and Excel exports (coming in Phase 5)
- **Privacy-First**: All data stored locally in your browser
- **No Account Required**: Single-user, completely private

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **AI**: Anthropic Claude API
- **Storage**: Browser localStorage
- **UI**: Custom components with cheerful color palette

## Project Structure

```
/health-journal/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API services
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilities
│   │   └── styles/         # Styles and theme
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── server.js       # Server entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**:
   ```bash
   cd /home/echeadle/Journal
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

   Or install manually:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. **Set up environment variables**:
   ```bash
   cd server
   cp .env.example .env
   ```

   Edit `server/.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

### Running the Application

#### Development Mode

Run both client and server concurrently:
```bash
npm run dev
```

Or run them separately:

**Terminal 1 - Frontend**:
```bash
npm run dev:client
```

**Terminal 2 - Backend**:
```bash
npm run dev:server
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Building for Production

```bash
npm run build
```

## Usage Guide

### First Time Setup

1. Visit http://localhost:5173
2. Click "Start My Journal"
3. Choose how many days to track (default: 5 days)
4. Click "Create Journal"

### Daily Check-ins

Each day has 5 check-in times:
1. **Upon Waking** - Track mood and energy
2. **After Breaking Fast** - Record mood and first meal
3. **Around Noon/After Lunch** - Track mood, energy, and lunch
4. **After Dinner** - Record mood and dinner
5. **Before Bed** - Track mood and energy

### Using the Chatbot

Click the floating chat button (💬) in the bottom right corner to:
- Ask questions about the journaling process
- Get help with check-ins
- Understand mood descriptors
- Get encouragement and support

### Dashboard

View your progress:
- Check-in completion status
- Daily progress indicators
- Quick access to each day's entries

### Review & Export

- **Review**: View visualizations and trends (coming in Phase 4)
- **Export**: Generate PDF/Excel reports (coming in Phase 5)

## Data Model

### Journal Configuration
```javascript
{
  journalDuration: 5,
  startDate: "2026-01-31",
  endDate: "2026-02-04",
  userId: "uuid",
  timezone: "America/New_York"
}
```

### Journal Entry
```javascript
{
  id: "uuid",
  date: "2026-01-31",
  dayNumber: 1,
  checkIns: [
    {
      timeSlot: "WAKING",
      timestamp: "2026-01-31T07:30:00Z",
      mood: {
        descriptors: ["happy", "energetic"],
        score: 4,
        notes: ""
      },
      energy: {
        score: 3,
        notes: ""
      }
    }
  ],
  foodEntries: [
    {
      type: "FIRST_MEAL",
      foods: ["oatmeal", "banana", "coffee"],
      notes: "",
      isBreakingFast: true
    }
  ]
}
```

## API Endpoints

### POST /api/chat
Send a message to the AI assistant.

**Request**:
```json
{
  "message": "What should I track?",
  "journalContext": {
    "currentDay": 1,
    "totalDays": 5,
    "completionPercentage": 20
  }
}
```

**Response**:
```json
{
  "success": true,
  "response": "I'm here to help you track...",
  "timestamp": "2026-01-31T12:00:00Z"
}
```

### GET /api/health
Health check endpoint.

## Development Status

### ✅ Completed (Phases 1-3)
- Project structure and setup
- Core journal functionality (mood, energy, food tracking)
- Dashboard with progress indicators
- Daily check-in flow
- AI chatbot integration
- Local storage persistence

### 🚧 In Progress
- Visualization and charts (Phase 4)
- Export functionality (Phase 5)

### 📋 Planned
- Polish and optimization (Phase 6)
- Deployment (Phase 7)

## Privacy & Security

- **No user accounts**: Completely privacy-first design
- **Local storage**: All data stays in your browser
- **No analytics**: No tracking or data collection
- **API key security**: Anthropic API key never exposed to frontend
- **Rate limiting**: Prevents API abuse

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Android Chrome)

## Troubleshooting

### Chat not working
- Check that your Anthropic API key is set in `server/.env`
- Verify the backend is running on port 3000
- Check browser console for errors

### Data not persisting
- Ensure localStorage is enabled in your browser
- Check that you're not in private/incognito mode
- Clear browser cache and try again

### Port already in use
Change the port in `server/.env`:
```
PORT=3001
```

And update the proxy in `client/vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3001'
  }
}
```

## Contributing

This is a personal health journal application. If you'd like to customize it for your own use, feel free to fork and modify!

## License

MIT

## Credits

Built with ❤️ using:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [Anthropic Claude](https://www.anthropic.com/)

---

**Note**: This app is for personal tracking only and is not a substitute for professional medical advice. Always consult with healthcare providers for medical concerns.
