export const getHoursMinutesFormatted = (stringDate: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = new Date(stringDate)
    .toLocaleDateString("it-IT", options)
    .split(",")[1];

  return formattedDate;
};
