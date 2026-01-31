# Data Model Reference

Complete reference for all data structures used in Health Journal.

## localStorage Keys

All data is stored in browser localStorage with these keys:

- `healthJournal_config` - Journal configuration and metadata
- `healthJournal_entries` - All daily journal entries
- `healthJournal_chatHistory` - Chat conversation history

## Configuration Object

**Key:** `healthJournal_config`

**Schema:**
```javascript
{
  journalId: string,      // UUID v4
  userId: string,         // UUID v4
  duration: number,       // Number of days (1-30)
  startDate: string,      // ISO date string "YYYY-MM-DD"
  createdAt: string       // ISO datetime string
}
```

**Example:**
```json
{
  "journalId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userId": "b2c3d4e5-f6g7-8901-bcde-f12345678901",
  "duration": 5,
  "startDate": "2024-01-31",
  "createdAt": "2024-01-31T10:30:00.000Z"
}
```

## Entries Array

**Key:** `healthJournal_entries`

**Schema:**
```javascript
[
  {
    entryId: string,        // UUID v4
    journalId: string,      // References journalId from config
    dayNumber: number,      // 1-based day number
    date: string,           // ISO date string "YYYY-MM-DD"
    checkIns: CheckIn[],    // Array of check-in objects
    foodEntries: Food[]     // Array of food entry objects
  },
  // ... more entries
]
```

**Example:**
```json
[
  {
    "entryId": "c3d4e5f6-g7h8-9012-cdef-123456789012",
    "journalId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "dayNumber": 1,
    "date": "2024-01-31",
    "checkIns": [],
    "foodEntries": []
  },
  {
    "entryId": "d4e5f6g7-h8i9-0123-defg-234567890123",
    "journalId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "dayNumber": 2,
    "date": "2024-02-01",
    "checkIns": [],
    "foodEntries": []
  }
]
```

## Check-in Object

**Schema:**
```javascript
{
  checkInId: string,        // UUID v4
  timeSlot: string,         // One of: WAKING, AFTER_FAST, NOON, AFTER_DINNER, BEDTIME
  timestamp: string,        // ISO datetime string
  mood?: {                  // Optional - only if timeSlot tracks mood
    descriptors: string[],  // Array of mood words (happy, calm, anxious, etc.)
    score: number          // 1-5 (1=low, 5=extreme)
  },
  energy?: {               // Optional - only if timeSlot tracks energy
    score: number          // 1-5 (1=low, 5=high)
  },
  notes?: string          // Optional user notes
}
```

**Example:**
```json
{
  "checkInId": "e5f6g7h8-i9j0-1234-efgh-345678901234",
  "timeSlot": "WAKING",
  "timestamp": "2024-01-31T07:30:00.000Z",
  "mood": {
    "descriptors": ["happy", "energetic", "optimistic"],
    "score": 4
  },
  "energy": {
    "score": 3
  },
  "notes": "Slept well, feeling good"
}
```

## Food Entry Object

**Schema:**
```javascript
{
  foodId: string,          // UUID v4
  timestamp: string,       // ISO datetime string
  type: string,           // One of: breakfast, lunch, dinner, snack
  foods: string[],        // Array of food items
  notes?: string         // Optional user notes
}
```

**Example:**
```json
{
  "foodId": "f6g7h8i9-j0k1-2345-fghi-456789012345",
  "timestamp": "2024-01-31T08:00:00.000Z",
  "type": "breakfast",
  "foods": ["oatmeal", "banana", "coffee", "almonds"],
  "notes": "First meal after 16-hour fast"
}
```

## Chat History Array

**Key:** `healthJournal_chatHistory`

**Schema:**
```javascript
[
  {
    role: string,         // "user" or "assistant"
    content: string,      // Message text
    timestamp: string    // ISO datetime string
  },
  // ... more messages
]
```

**Example:**
```json
[
  {
    "role": "user",
    "content": "How am I doing with my mood tracking?",
    "timestamp": "2024-01-31T14:30:00.000Z"
  },
  {
    "role": "assistant",
    "content": "You're doing great! You've completed 60% of your check-ins so far. I notice you're consistently tracking 'happy' and 'energetic' moods in the morning, which is wonderful.",
    "timestamp": "2024-01-31T14:30:02.000Z"
  }
]
```

## Constants Reference

### Time Slots

Defined in `client/src/utils/constants.js`:

```javascript
export const TIME_SLOTS = [
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
  {
    id: 'NOON',
    label: 'Noon / After Lunch',
    tracks: ['mood', 'energy', 'food'],
    description: 'Mid-day check-in'
  },
  {
    id: 'AFTER_DINNER',
    label: 'After Dinner',
    tracks: ['mood', 'energy', 'food'],
    description: 'Evening meal and how you feel'
  },
  {
    id: 'BEDTIME',
    label: 'Before Bed',
    tracks: ['mood', 'energy'],
    description: 'End of day reflection'
  }
];
```

### Mood Descriptors

```javascript
export const MOOD_DESCRIPTORS = [
  'happy',
  'calm',
  'energetic',
  'optimistic',
  'content',
  'anxious',
  'sad',
  'irritable',
  'stressed',
  'tired',
  'depressed',
  'flat'
];
```

### Energy Scale

```javascript
export const ENERGY_SCALE = [
  { value: 1, label: 'Very Low', emoji: '😴' },
  { value: 2, label: 'Low', emoji: '😔' },
  { value: 3, label: 'Moderate', emoji: '😐' },
  { value: 4, label: 'High', emoji: '😊' },
  { value: 5, label: 'Very High', emoji: '🚀' }
];
```

### Food Types

```javascript
export const FOOD_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' }
];
```

## Data Validation Rules

### Configuration
- `duration`: 1-30 (integer)
- `startDate`: Valid ISO date string
- `journalId`, `userId`: Valid UUID v4

### Check-ins
- `timeSlot`: Must be one of the 5 defined TIME_SLOTS
- `mood.score`: 1-5 (integer)
- `mood.descriptors`: Array of strings from MOOD_DESCRIPTORS
- `energy.score`: 1-5 (integer)
- `timestamp`: Valid ISO datetime string

### Food Entries
- `type`: Must be one of FOOD_TYPES values
- `foods`: Non-empty array of strings
- `timestamp`: Valid ISO datetime string

## Service Methods Reference

### storageService

**Configuration:**
- `createConfig(duration)` - Create new journal config
- `getConfig()` - Retrieve config
- `updateConfig(updates)` - Update config fields

**Entries:**
- `getEntries()` - Get all entries
- `getEntry(entryId)` - Get specific entry
- `createEntries(config)` - Initialize empty entries for journal duration

**Check-ins:**
- `addCheckIn(entryId, checkInData)` - Add check-in to entry
- `updateCheckIn(checkInId, updates)` - Update existing check-in
- `deleteCheckIn(checkInId)` - Remove check-in
- `getCheckIn(checkInId)` - Get specific check-in

**Food:**
- `addFoodEntry(entryId, foodData)` - Add food entry
- `updateFoodEntry(foodId, updates)` - Update food entry
- `deleteFoodEntry(foodId)` - Remove food entry

**Chat:**
- `getChatHistory()` - Get all messages
- `addChatMessage(role, content)` - Add message
- `clearChatHistory()` - Delete all messages

## API Request/Response Formats

### POST /api/chat

**Request:**
```javascript
{
  message: string,              // Required
  journalContext?: {           // Optional
    currentDay: number,
    totalDays: number,
    completedCheckIns: string[],
    pendingCheckIns: string[],
    completionPercentage: number
  }
}
```

**Success Response:**
```javascript
{
  success: true,
  message: string,
  usage: {
    inputTokens: number,
    outputTokens: number
  }
}
```

**Error Response:**
```javascript
{
  success: false,
  error: string
}
```

### GET /api/health

**Response:**
```javascript
{
  status: 'ok',
  timestamp: string  // ISO datetime
}
```

## Migration and Versioning

Currently no versioning system in place. Future considerations:

- Add `version` field to config
- Implement migration functions for schema changes
- Validate data on load and migrate if needed
- Backup data before migrations

## Data Size Estimates

For a typical 5-day journal:
- Config: ~200 bytes
- Entries: ~50 KB (with full check-ins and food logs)
- Chat History: ~10-50 KB (depending on conversation length)
- **Total: ~60-100 KB**

localStorage limit is typically 5-10 MB, so plenty of room for growth.
