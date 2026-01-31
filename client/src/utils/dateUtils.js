import { format, addDays, parseISO, startOfDay, differenceInDays } from 'date-fns';

export const formatDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatDisplayDate = (date) => {
  return format(new Date(date), 'MMMM d, yyyy');
};

export const formatTime = (date) => {
  return format(new Date(date), 'h:mm a');
};

export const generateDateRange = (startDate, days) => {
  const dates = [];
  const start = startOfDay(new Date(startDate));

  for (let i = 0; i < days; i++) {
    dates.push(formatDate(addDays(start, i)));
  }

  return dates;
};

export const getDayNumber = (date, startDate) => {
  const dayDiff = differenceInDays(
    startOfDay(new Date(date)),
    startOfDay(new Date(startDate))
  );
  return dayDiff + 1;
};

export const isToday = (date) => {
  const today = formatDate(new Date());
  return formatDate(new Date(date)) === today;
};

export const isPast = (date) => {
  const today = startOfDay(new Date());
  const checkDate = startOfDay(new Date(date));
  return checkDate < today;
};

export const isFuture = (date) => {
  const today = startOfDay(new Date());
  const checkDate = startOfDay(new Date(date));
  return checkDate > today;
};

export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};
