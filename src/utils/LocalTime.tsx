// Convert ISO string to local time
export const formatLocalTime = (isoString: string) => {
  const dateObj = new Date(isoString);
  return dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Convert ISO string to local date
export const formatLocalDate = (isoString: string) => {
  const dateObj = new Date(isoString);
  return dateObj.toLocaleDateString([], {
    day: "2-digit",
    month: "short", // "Feb", "Dec", etc
    year: "numeric",
  });
};
