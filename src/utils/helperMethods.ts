export function validateEmail(e: string) {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regex.test(e);
}

export function makeLocaleString(
  value: number | string | undefined | null,
  minFractionDigits: number = 0
) {
  if (value == null || value === "") return "";

  // can set the minimum decimal places required for value (ex: currency with min 2 decimal places)
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: minFractionDigits,
  });
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return seconds + " seconds ago";
  }

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return minutes + " minutes ago";
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return hours + " hours ago";
  }

  const days = Math.round(hours / 24);
  if (days < 7) {
    return days + " days ago";
  }

  const weeks = Math.round(days / 7);
  if (weeks < 4) {
    return weeks + " weeks ago";
  }

  const months = Math.round(days / 30);
  if (months < 12) {
    return months + " months ago";
  }

  const years = Math.round(months / 12);
  return years + " years ago";
}
