/**
 * Central Date & Time Utility for KMRL NEXUS
 * Formats all timestamps in IST (Indian Standard Time, UTC+5:30)
 */

export const formatISTDate = (dateString?: string | Date): string => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return String(dateString);

  return d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatISTTime = (dateString?: string | Date): string => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export const formatISTFull = (dateString?: string | Date): string => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return String(dateString);

  const datePart = d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const timePart = d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${datePart}, ${timePart} IST`;
};

export interface DeadlineStatus {
  label: string;
  isOverdue: boolean;
  isUrgent: boolean;
  daysRemaining: number;
  badgeColor: string;
}

export const getDeadlineStatus = (deadlineString?: string): DeadlineStatus => {
  if (!deadlineString) {
    return {
      label: 'No Deadline',
      isOverdue: false,
      isUrgent: false,
      daysRemaining: 999,
      badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
    };
  }

  const deadline = new Date(deadlineString);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysOverdue = Math.abs(diffDays);
    return {
      label: daysOverdue === 1 ? 'OVERDUE BY 1 DAY' : `OVERDUE BY ${daysOverdue} DAYS`,
      isOverdue: true,
      isUrgent: true,
      daysRemaining: diffDays,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse',
    };
  } else if (diffDays === 0) {
    return {
      label: 'DUE TODAY',
      isOverdue: false,
      isUrgent: true,
      daysRemaining: 0,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse',
    };
  } else if (diffDays === 1) {
    return {
      label: 'DUE TOMORROW',
      isOverdue: false,
      isUrgent: true,
      daysRemaining: 1,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    };
  } else if (diffDays <= 4) {
    return {
      label: `Due in ${diffDays} days`,
      isOverdue: false,
      isUrgent: true,
      daysRemaining: diffDays,
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    };
  } else {
    return {
      label: `Due in ${diffDays} days`,
      isOverdue: false,
      isUrgent: false,
      daysRemaining: diffDays,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    };
  }
};
