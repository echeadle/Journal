import { TIME_SLOTS, MOOD_DESCRIPTORS } from './constants';

/**
 * Analytics utilities for aggregating journal data for visualizations
 */

/**
 * Get mood trend data for line chart
 * Returns array of { dayNumber, date, avgMoodScore, checkInCount }
 */
export function getMoodTrendData(entries) {
  if (!entries || !entries.length) return [];

  return entries.map(entry => {
    const moodCheckIns = entry.checkIns.filter(c => c.mood?.score);
    const avgScore = moodCheckIns.length > 0
      ? moodCheckIns.reduce((sum, c) => sum + c.mood.score, 0) / moodCheckIns.length
      : null;

    return {
      dayNumber: entry.dayNumber,
      date: entry.date,
      avgMoodScore: avgScore ? Math.round(avgScore * 10) / 10 : null,
      checkInCount: moodCheckIns.length
    };
  }).filter(d => d.avgMoodScore !== null);
}

/**
 * Get energy pattern data for bar chart
 * Returns array of { dayNumber, date, avgEnergyScore, checkInCount }
 */
export function getEnergyPatternData(entries) {
  if (!entries || !entries.length) return [];

  return entries.map(entry => {
    const energyCheckIns = entry.checkIns.filter(c => c.energy?.score);
    const avgScore = energyCheckIns.length > 0
      ? energyCheckIns.reduce((sum, c) => sum + c.energy.score, 0) / energyCheckIns.length
      : null;

    return {
      dayNumber: entry.dayNumber,
      date: entry.date,
      avgEnergyScore: avgScore ? Math.round(avgScore * 10) / 10 : null,
      checkInCount: energyCheckIns.length
    };
  }).filter(d => d.avgEnergyScore !== null);
}

/**
 * Get eating window data for visualization
 * Returns array of { dayNumber, date, firstMeal, lastMeal, windowHours, mealCount }
 */
export function getEatingWindowData(entries) {
  if (!entries || !entries.length) return [];

  return entries.map(entry => {
    if (!entry.foodEntries || entry.foodEntries.length === 0) {
      return null;
    }

    const sortedMeals = [...entry.foodEntries]
      .filter(f => f.timestamp)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (sortedMeals.length === 0) return null;

    const firstMeal = new Date(sortedMeals[0].timestamp);
    const lastMeal = new Date(sortedMeals[sortedMeals.length - 1].timestamp);
    const windowHours = (lastMeal - firstMeal) / (1000 * 60 * 60);

    return {
      dayNumber: entry.dayNumber,
      date: entry.date,
      firstMealTime: firstMeal.getHours() + firstMeal.getMinutes() / 60,
      lastMealTime: lastMeal.getHours() + lastMeal.getMinutes() / 60,
      windowHours: Math.round(windowHours * 10) / 10,
      mealCount: entry.foodEntries.length
    };
  }).filter(d => d !== null);
}

/**
 * Get mood by time slot data
 * Returns array of { timeSlot, label, avgMoodScore, count }
 */
export function getMoodByTimeSlot(entries) {
  if (!entries || !entries.length) return [];

  const slotData = {};

  TIME_SLOTS.forEach(slot => {
    slotData[slot.id] = { scores: [], label: slot.label };
  });

  entries.forEach(entry => {
    entry.checkIns.forEach(checkIn => {
      if (checkIn.mood?.score && slotData[checkIn.timeSlot]) {
        slotData[checkIn.timeSlot].scores.push(checkIn.mood.score);
      }
    });
  });

  return TIME_SLOTS.map(slot => ({
    timeSlot: slot.id,
    label: slot.label,
    avgMoodScore: slotData[slot.id].scores.length > 0
      ? Math.round(slotData[slot.id].scores.reduce((a, b) => a + b, 0) / slotData[slot.id].scores.length * 10) / 10
      : null,
    count: slotData[slot.id].scores.length
  }));
}

/**
 * Get energy by time slot data
 * Returns array of { timeSlot, label, avgEnergyScore, count }
 */
export function getEnergyByTimeSlot(entries) {
  if (!entries || !entries.length) return [];

  const slotData = {};

  TIME_SLOTS.forEach(slot => {
    if (slot.tracks.includes('energy')) {
      slotData[slot.id] = { scores: [], label: slot.label };
    }
  });

  entries.forEach(entry => {
    entry.checkIns.forEach(checkIn => {
      if (checkIn.energy?.score && slotData[checkIn.timeSlot]) {
        slotData[checkIn.timeSlot].scores.push(checkIn.energy.score);
      }
    });
  });

  return TIME_SLOTS
    .filter(slot => slot.tracks.includes('energy'))
    .map(slot => ({
      timeSlot: slot.id,
      label: slot.label,
      avgEnergyScore: slotData[slot.id].scores.length > 0
        ? Math.round(slotData[slot.id].scores.reduce((a, b) => a + b, 0) / slotData[slot.id].scores.length * 10) / 10
        : null,
      count: slotData[slot.id].scores.length
    }));
}

/**
 * Get mood descriptor frequency
 * Returns array of { descriptor, label, emoji, count, percentage }
 */
export function getMoodDescriptorFrequency(entries) {
  if (!entries || !entries.length) return [];

  const counts = {};
  let total = 0;

  entries.forEach(entry => {
    entry.checkIns.forEach(checkIn => {
      if (checkIn.mood?.descriptors) {
        checkIn.mood.descriptors.forEach(desc => {
          counts[desc] = (counts[desc] || 0) + 1;
          total++;
        });
      }
    });
  });

  return MOOD_DESCRIPTORS
    .map(desc => ({
      descriptor: desc.id,
      label: desc.label,
      emoji: desc.emoji,
      color: desc.color,
      count: counts[desc.id] || 0,
      percentage: total > 0 ? Math.round((counts[desc.id] || 0) / total * 100) : 0
    }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count);
}

/**
 * Get daily summary data for accordion view
 * Returns array of { dayNumber, date, moodAvg, energyAvg, moodDescriptors, foodCount, checkInCount, totalSlots }
 */
export function getDailySummaries(entries) {
  if (!entries || !entries.length) return [];

  return entries.map(entry => {
    const moodScores = entry.checkIns
      .filter(c => c.mood?.score)
      .map(c => c.mood.score);

    const energyScores = entry.checkIns
      .filter(c => c.energy?.score)
      .map(c => c.energy.score);

    const allDescriptors = entry.checkIns
      .filter(c => c.mood?.descriptors)
      .flatMap(c => c.mood.descriptors);

    const descriptorCounts = allDescriptors.reduce((acc, desc) => {
      acc[desc] = (acc[desc] || 0) + 1;
      return acc;
    }, {});

    const topDescriptors = Object.entries(descriptorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([desc]) => {
        const found = MOOD_DESCRIPTORS.find(m => m.id === desc);
        return found ? { id: desc, emoji: found.emoji, label: found.label } : null;
      })
      .filter(Boolean);

    return {
      dayNumber: entry.dayNumber,
      date: entry.date,
      moodAvg: moodScores.length > 0
        ? Math.round(moodScores.reduce((a, b) => a + b, 0) / moodScores.length * 10) / 10
        : null,
      energyAvg: energyScores.length > 0
        ? Math.round(energyScores.reduce((a, b) => a + b, 0) / energyScores.length * 10) / 10
        : null,
      topDescriptors,
      foodCount: entry.foodEntries?.length || 0,
      checkInCount: entry.checkIns.length,
      totalSlots: TIME_SLOTS.length,
      checkIns: entry.checkIns,
      foodEntries: entry.foodEntries || []
    };
  });
}

/**
 * Filter entries by date range
 */
export function filterEntriesByDateRange(entries, startDate, endDate) {
  if (!entries || !entries.length) return [];
  if (!startDate && !endDate) return entries;

  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    if (startDate && entryDate < new Date(startDate)) return false;
    if (endDate && entryDate > new Date(endDate)) return false;
    return true;
  });
}

/**
 * Get overall statistics summary
 */
export function getOverallStats(entries) {
  if (!entries || !entries.length) return null;

  const allMoodScores = entries.flatMap(e =>
    e.checkIns.filter(c => c.mood?.score).map(c => c.mood.score)
  );

  const allEnergyScores = entries.flatMap(e =>
    e.checkIns.filter(c => c.energy?.score).map(c => c.energy.score)
  );

  const totalFoodEntries = entries.reduce((sum, e) => sum + (e.foodEntries?.length || 0), 0);
  const totalCheckIns = entries.reduce((sum, e) => sum + e.checkIns.length, 0);

  return {
    avgMood: allMoodScores.length > 0
      ? Math.round(allMoodScores.reduce((a, b) => a + b, 0) / allMoodScores.length * 10) / 10
      : null,
    avgEnergy: allEnergyScores.length > 0
      ? Math.round(allEnergyScores.reduce((a, b) => a + b, 0) / allEnergyScores.length * 10) / 10
      : null,
    totalMoodEntries: allMoodScores.length,
    totalEnergyEntries: allEnergyScores.length,
    totalFoodEntries,
    totalCheckIns,
    daysWithData: entries.filter(e => e.checkIns.length > 0).length,
    totalDays: entries.length
  };
}
