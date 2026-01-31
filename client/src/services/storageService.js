import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, DEFAULT_JOURNAL_DURATION } from '../utils/constants';
import { formatDate, generateDateRange, getCurrentTimestamp } from '../utils/dateUtils';

class StorageService {
  // Configuration Methods
  getConfig() {
    const config = localStorage.getItem(STORAGE_KEYS.JOURNAL_CONFIG);
    return config ? JSON.parse(config) : null;
  }

  createConfig(duration = DEFAULT_JOURNAL_DURATION) {
    const startDate = formatDate(new Date());
    const config = {
      journalId: uuidv4(),
      journalDuration: duration,
      startDate,
      endDate: generateDateRange(startDate, duration)[duration - 1],
      userId: uuidv4(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      createdAt: getCurrentTimestamp()
    };

    localStorage.setItem(STORAGE_KEYS.JOURNAL_CONFIG, JSON.stringify(config));
    this.initializeEntries(config);
    return config;
  }

  updateConfig(updates) {
    const config = this.getConfig();
    if (!config) return null;

    const updatedConfig = { ...config, ...updates };
    localStorage.setItem(STORAGE_KEYS.JOURNAL_CONFIG, JSON.stringify(updatedConfig));
    return updatedConfig;
  }

  deleteConfig() {
    localStorage.removeItem(STORAGE_KEYS.JOURNAL_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  }

  // Journal Entries Methods
  initializeEntries(config) {
    const dates = generateDateRange(config.startDate, config.journalDuration);
    const entries = dates.map((date, index) => ({
      id: uuidv4(),
      journalId: config.journalId,
      date,
      dayNumber: index + 1,
      checkIns: [],
      foodEntries: []
    }));

    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
    return entries;
  }

  getAllEntries() {
    const entries = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    return entries ? JSON.parse(entries) : [];
  }

  getEntryByDate(date) {
    const entries = this.getAllEntries();
    return entries.find(entry => entry.date === formatDate(date));
  }

  getEntryByDayNumber(dayNumber) {
    const entries = this.getAllEntries();
    return entries.find(entry => entry.dayNumber === dayNumber);
  }

  updateEntry(entryId, updates) {
    const entries = this.getAllEntries();
    const index = entries.findIndex(entry => entry.id === entryId);

    if (index === -1) return null;

    entries[index] = { ...entries[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
    return entries[index];
  }

  // Check-in Methods
  addCheckIn(entryId, checkInData) {
    const entry = this.getAllEntries().find(e => e.id === entryId);
    if (!entry) return null;

    const checkIn = {
      id: uuidv4(),
      timestamp: getCurrentTimestamp(),
      completed: true,
      ...checkInData
    };

    const existingCheckInIndex = entry.checkIns.findIndex(
      c => c.timeSlot === checkIn.timeSlot
    );

    if (existingCheckInIndex >= 0) {
      entry.checkIns[existingCheckInIndex] = checkIn;
    } else {
      entry.checkIns.push(checkIn);
    }

    this.updateEntry(entryId, { checkIns: entry.checkIns });
    return checkIn;
  }

  getCheckIn(entryId, timeSlot) {
    const entry = this.getAllEntries().find(e => e.id === entryId);
    if (!entry) return null;

    return entry.checkIns.find(c => c.timeSlot === timeSlot);
  }

  updateCheckIn(entryId, checkInId, updates) {
    const entry = this.getAllEntries().find(e => e.id === entryId);
    if (!entry) return null;

    const checkInIndex = entry.checkIns.findIndex(c => c.id === checkInId);
    if (checkInIndex === -1) return null;

    entry.checkIns[checkInIndex] = { ...entry.checkIns[checkInIndex], ...updates };
    this.updateEntry(entryId, { checkIns: entry.checkIns });
    return entry.checkIns[checkInIndex];
  }

  // Food Entry Methods
  addFoodEntry(entryId, foodData) {
    const entry = this.getAllEntries().find(e => e.id === entryId);
    if (!entry) return null;

    const foodEntry = {
      id: uuidv4(),
      timestamp: getCurrentTimestamp(),
      ...foodData
    };

    entry.foodEntries.push(foodEntry);
    this.updateEntry(entryId, { foodEntries: entry.foodEntries });
    return foodEntry;
  }

  updateFoodEntry(entryId, foodEntryId, updates) {
    const entry = this.getAllEntries().find(e => e.id === entryId);
    if (!entry) return null;

    const foodIndex = entry.foodEntries.findIndex(f => f.id === foodEntryId);
    if (foodIndex === -1) return null;

    entry.foodEntries[foodIndex] = { ...entry.foodEntries[foodIndex], ...updates };
    this.updateEntry(entryId, { foodEntries: entry.foodEntries });
    return entry.foodEntries[foodIndex];
  }

  deleteFoodEntry(entryId, foodEntryId) {
    const entry = this.getAllEntries().find(e => e.id === entryId);
    if (!entry) return false;

    entry.foodEntries = entry.foodEntries.filter(f => f.id !== foodEntryId);
    this.updateEntry(entryId, { foodEntries: entry.foodEntries });
    return true;
  }

  // Chat History Methods
  getChatHistory() {
    const history = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return history ? JSON.parse(history) : [];
  }

  addChatMessage(message) {
    const history = this.getChatHistory();
    history.push({
      id: uuidv4(),
      timestamp: getCurrentTimestamp(),
      ...message
    });
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
    return history;
  }

  clearChatHistory() {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify([]));
  }

  // Statistics & Analytics
  getCompletionStats() {
    const entries = this.getAllEntries();
    const config = this.getConfig();

    if (!entries.length || !config) return null;

    const totalTimeSlots = entries.length * 5; // 5 check-ins per day
    const completedCheckIns = entries.reduce(
      (sum, entry) => sum + entry.checkIns.length,
      0
    );

    return {
      totalDays: config.journalDuration,
      completedDays: entries.filter(e => e.checkIns.length > 0).length,
      totalCheckIns: totalTimeSlots,
      completedCheckIns,
      completionPercentage: Math.round((completedCheckIns / totalTimeSlots) * 100),
      totalFoodEntries: entries.reduce((sum, entry) => sum + entry.foodEntries.length, 0)
    };
  }

  // Export Data
  exportAllData() {
    return {
      config: this.getConfig(),
      entries: this.getAllEntries(),
      chatHistory: this.getChatHistory(),
      stats: this.getCompletionStats(),
      exportedAt: getCurrentTimestamp()
    };
  }
}

export default new StorageService();
