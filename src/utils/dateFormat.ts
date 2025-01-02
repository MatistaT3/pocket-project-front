import { format, isValid, parseISO, isSameDay as isSameDayFns } from "date-fns";
import { es } from "date-fns/locale";

export const DATE_FORMAT = {
  API: "yyyy-MM-dd", // Formato para la base de datos
  DISPLAY: "dd/MM/yyyy", // Formato para mostrar al usuario
  MONTH_YEAR: "MMMM yyyy",
  DAY: "d",
  MONTH: "MMMM",
  YEAR: "yyyy",
  WEEKDAY: "EEEE",
  HOUR: "HH:mm",
  FULL: "EEEE d 'de' MMMM 'de' yyyy",
  FULL_WITH_TIME: "EEEE d 'de' MMMM 'de' yyyy HH:mm",
};

// Convierte una fecha a formato de API (YYYY-MM-DD)
export const toAPIDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === "string" ? parseInputDate(date) : date;
    return format(dateObj, DATE_FORMAT.API);
  } catch (error) {
    console.error("Error converting to API date:", error);
    return "";
  }
};

// Convierte una fecha a formato de visualización (DD/MM/YYYY)
export const toDisplayDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === "string" ? parseInputDate(date) : date;
    return format(dateObj, DATE_FORMAT.DISPLAY, { locale: es });
  } catch (error) {
    console.error("Error converting to display date:", error);
    return "";
  }
};

// Parsea una fecha de cualquier formato soportado a objeto Date
export const parseInputDate = (date: string): Date => {
  try {
    // Si la fecha viene en formato DD/MM/YYYY
    if (date.includes("/")) {
      const [day, month, year] = date.split("/");
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    // Si la fecha viene en formato YYYY-MM-DD
    if (date.includes("-")) {
      // Agregamos T12:00:00 para evitar problemas de zona horaria
      return new Date(date + "T12:00:00");
    }

    // Si es una fecha ISO
    return parseISO(date);
  } catch (error) {
    console.error("Error parsing date:", error);
    return new Date();
  }
};

// Convierte una fecha a formato personalizado
export const formatDate = (
  date: Date | string,
  formatStr: string = DATE_FORMAT.DISPLAY
): string => {
  try {
    const dateObj = typeof date === "string" ? parseInputDate(date) : date;
    if (!isValid(dateObj)) {
      throw new Error("Invalid date");
    }
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const isSameDay = isSameDayFns;
