import { format, isValid, parseISO, isSameDay as isSameDayFns } from "date-fns";
import { es } from "date-fns/locale";

export const DATE_FORMAT = {
  API: "dd/MM/yyyy",
  MONTH_YEAR: "MMMM yyyy",
  DAY: "d",
  MONTH: "MMMM",
  YEAR: "yyyy",
  WEEKDAY: "EEEE",
  HOUR: "HH:mm",
  FULL: "EEEE d 'de' MMMM 'de' yyyy",
  FULL_WITH_TIME: "EEEE d 'de' MMMM 'de' yyyy HH:mm",
  FULL_WITH_TIME_AND_SECONDS: "EEEE d 'de' MMMM 'de' yyyy HH:mm:ss",
};

export const formatDate = (
  date: Date | string,
  formatStr: string = DATE_FORMAT.API
): string => {
  try {
    if (typeof date === "string") {
      // Si es una fecha en formato DD/MM/YYYY
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        // Si es una fecha en formato ISO
        date = parseISO(date);
      }
    }

    if (!isValid(date)) {
      throw new Error("Invalid date");
    }

    return format(date, formatStr, { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const isSameDay = isSameDayFns;
