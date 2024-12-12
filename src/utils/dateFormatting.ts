import { format, getISOWeek, isToday, isSameWeek } from "date-fns";

const DUTCH_DAY_ABBREVIATIONS: { [key: string]: string } = {
  'Mon': 'ma',
  'Tue': 'di',
  'Wed': 'wo',
  'Thu': 'do',
  'Fri': 'vr',
  'Sat': 'za',
  'Sun': 'zo'
};

export const formatDutchDayAbbrev = (date: Date): string => {
  const englishAbbrev = format(date, 'EEE');
  return DUTCH_DAY_ABBREVIATIONS[englishAbbrev] || englishAbbrev.toLowerCase();
};

export const formatDayNumber = (date: Date): string => {
  return format(date, "d");
};

export const formatMonthYear = (date: Date): string => {
  const month = format(date, "MMMM");
  const year = format(date, "yyyy");
  return `${month} ${year}`;
};

export const getWeekDisplay = (date: Date): { number: number; isCurrent: boolean } => {
  return {
    number: getISOWeek(date),
    isCurrent: isSameWeek(date, new Date(), { weekStartsOn: 1 }),
  };
};