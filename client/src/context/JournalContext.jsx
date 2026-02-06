import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import storageService from '../services/storageService';

const JournalContext = createContext(null);

export const JournalProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJournalData();
  }, []);

  const loadJournalData = useCallback(() => {
    setLoading(true);
    const savedConfig = storageService.getConfig();
    const savedEntries = storageService.getAllEntries();

    setConfig(savedConfig);
    setEntries(savedEntries);
    setLoading(false);
  }, []);

  const createJournal = useCallback((duration) => {
    const newConfig = storageService.createConfig(duration);
    const newEntries = storageService.getAllEntries();

    setConfig(newConfig);
    setEntries(newEntries);
    return newConfig;
  }, []);

  const deleteJournal = useCallback(() => {
    storageService.deleteConfig();
    setConfig(null);
    setEntries([]);
  }, []);

  const getEntry = useCallback((date) => {
    return storageService.getEntryByDate(date);
  }, []);

  const getEntryByDay = useCallback((dayNumber) => {
    return storageService.getEntryByDayNumber(dayNumber);
  }, []);

  const addCheckIn = useCallback((entryId, checkInData) => {
    const checkIn = storageService.addCheckIn(entryId, checkInData);
    loadJournalData();
    return checkIn;
  }, [loadJournalData]);

  const updateCheckIn = useCallback((entryId, checkInId, updates) => {
    const checkIn = storageService.updateCheckIn(entryId, checkInId, updates);
    loadJournalData();
    return checkIn;
  }, [loadJournalData]);

  const addFoodEntry = useCallback((entryId, foodData) => {
    const foodEntry = storageService.addFoodEntry(entryId, foodData);
    loadJournalData();
    return foodEntry;
  }, [loadJournalData]);

  const updateFoodEntry = useCallback((entryId, foodEntryId, updates) => {
    const foodEntry = storageService.updateFoodEntry(entryId, foodEntryId, updates);
    loadJournalData();
    return foodEntry;
  }, [loadJournalData]);

  const deleteFoodEntry = useCallback((entryId, foodEntryId) => {
    storageService.deleteFoodEntry(entryId, foodEntryId);
    loadJournalData();
  }, [loadJournalData]);

  const getCompletionStats = useCallback(() => {
    return storageService.getCompletionStats();
  }, []);

  const exportData = useCallback(() => {
    return storageService.exportAllData();
  }, []);

  const value = useMemo(() => ({
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
  }), [
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
    loadJournalData
  ]);

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
