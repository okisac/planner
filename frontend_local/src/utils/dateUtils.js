export const parseDeadlineDate = (dateStr) => {
  if (!dateStr) return { day: "00", month: "Jan", year: "2000", urgency: 0 };

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const urgency = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: months[date.getMonth()],
    year: date.getFullYear(),
    urgency,
  };
};
