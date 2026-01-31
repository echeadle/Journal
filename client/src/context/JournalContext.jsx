import React, { createContext, useContext, useState, useEffect } from 'react';
import storageService from '../services/storageService';

const JournalContext = createContext(null);

export const JournalProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJournalData();
  }, []);

  const loadJournalData = () => {
    setLoading(true);
    const savedConfig = storageService.getConfig();
    const savedEntries = storageService.getAllEntries();

    setConfig(savedConfig);
    setEntries(savedEntries);
    setLoading(false);
  };

  const createJournal = (duration) => {
    const newConfig = storageService.createConfig(duration);
    const newEntries = storageService.getAllEntries();

    setConfig(newConfig);
    setEntries(newEntries);
    return newConfig;
  };

  const deleteJournal = () => {
    storageService.deleteConfig();
    setConfig(null);
    setEntries([]);
  };

  const getEntry = (date) => {
    return storageService.getEntryByDate(date);
  };

  const getEntryByDay = (dayNumber) => {
    return storageService.getEntryByDayNumber(dayNumber);
  };

  const addCheckIn = (entryId, checkInData) => {
    const checkIn = storageService.addCheckIn(entryId, checkInData);
    loadJournalData();
    return checkIn;
  };

  const updateCheckIn = (entryId, checkInId, updates) => {
    const checkIn = storageService.updateCheckIn(entryId, checkInId, updates);
    loadJournalData();
    return checkIn;
  };

  const addFoodEntry = (entryId, foodData) => {
    const foodEntry = storageService.addFoodEntry(entryId, foodData);
    loadJournalData();
    return foodEntry;
  };

  const updateFoodEntry = (entryId, foodEntryId, updates) => {
    const foodEntry = storageService.updateFoodEntry(entryId, foodEntryId, updates);
    loadJournalData();
    return foodEntry;
  };

  const deleteFoodEntry = (entryId, foodEntryId) => {
    storageService.deleteFoodEntry(entryId, foodEntryId);
    loadJournalData();
  };

  const getCompletionStats = () => {
    return storageService.getCompletionStats();
  };

  const exportData = () => {
    return storageService.exportAllData();
  };

  const value = {
    config,
    entries,
    loading,
    createJournal,
    deleteJournal,
    getEntry,
    getEntryByDay,
    addCheckIn,
    updateCheckIn,
    addFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
    getCompletionStats,
    exportData,
    refresh: loadJournalData
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

export default JournalContext;
