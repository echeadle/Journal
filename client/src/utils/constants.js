export const TIME_SLOTS = [
  {
    id: 'WAKING',
    label: 'Upon Waking',
    tracks: ['mood', 'energy'],
    description: 'How you feel when you first wake up'
  },
  {
    id: 'AFTER_FAST',
    label: 'After Breaking Fast',
    tracks: ['mood', 'food'],
    description: 'Your first meal and how you feel'
  },
  {
    id: 'NOON',
    label: 'Around Noon/After Lunch',
    tracks: ['mood', 'energy', 'food'],
    description: 'Midday check-in with lunch'
  },
  {
    id: 'AFTER_DINNER',
    label: 'After Dinner',
    tracks: ['mood', 'food'],
    description: 'Evening meal and feelings'
  },
  {
    id: 'BEDTIME',
    label: 'Before Bed',
    tracks: ['mood', 'energy'],
    description: 'End of day reflection'
  }
];

export const MOOD_DESCRIPTORS = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#FFD700' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#87CEEB' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', color: '#32CD32' },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#FFA07A' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#9370DB' },
  { id: 'tired', label: 'Tired', emoji: '😴', color: '#B0C4DE' },
  { id: 'focused', label: 'Focused', emoji: '🎯', color: '#4169E1' },
  { id: 'irritable', label: 'Irritable', emoji: '😠', color: '#FF6347' },
  { id: 'content', label: 'Content', emoji: '😊', color: '#98D8C8' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😵', color: '#FF8C00' }
];

export const MOOD_SCALE = {
  1: { label: 'Very Low', emoji: '😔' },
  2: { label: 'Low', emoji: '😕' },
  3: { label: 'Neutral', emoji: '😐' },
  4: { label: 'Good', emoji: '🙂' },
  5: { label: 'Great', emoji: '😊' }
};

export const ENERGY_SCALE = {
  1: { label: 'Exhausted', emoji: '🪫' },
  2: { label: 'Low', emoji: '🔋' },
  3: { label: 'Moderate', emoji: '🔋🔋' },
  4: { label: 'High', emoji: '🔋🔋🔋' },
  5: { label: 'Peak', emoji: '⚡' }
};

export const DEFAULT_JOURNAL_DURATION = 5;

export const STORAGE_KEYS = {
  JOURNAL_CONFIG: 'healthJournal_config',
  JOURNAL_ENTRIES: 'healthJournal_entries',
  CHAT_HISTORY: 'healthJournal_chatHistory'
};

export const FOOD_TYPES = {
  FIRST_MEAL: 'First Meal',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snack',
  OTHER: 'Other'
};
