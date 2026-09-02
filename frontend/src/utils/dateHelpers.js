import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';

export function getWeekRange(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });     // Sunday
  return {
    week_start_date: format(start, 'yyyy-MM-dd'),
    week_end_date: format(end, 'yyyy-MM-dd')
  };
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM d, yyyy');
  } catch (err) {
    return dateString;
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (err) {
    return dateString;
  }
}
