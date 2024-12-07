import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const DATE_FORMAT = {
  API: "dd/MM/yyyy",
  DISPLAY: "dd/MM/yyyy",
  DISPLAY_WITH_TIME: "dd/MM/yyyy HH:mm",
  MONTH_YEAR: "MMMM yyyy",
  DAY: "d",
  FULL_DATE: "d 'de' MMMM",
};

/**
 * Recibe una fecha como `Date` o string (en formato ISO) y la formatea según el formato proporcionado.
 * Si la fecha es inválida, retorna una cadena vacía.
 */
export const formatDate = (
  date: Date | string,
  formatStr: string = DATE_FORMAT.DISPLAY
): string => {
  let dateObj: Date;

  if (typeof date === "string") {
    // Intentamos parsear la fecha desde una cadena ISO
    // Si no es una cadena ISO válida, new Date() podría resultar en una fecha inválida.
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }

  if (!isValid(dateObj)) {
    console.error("Error: la fecha proporcionada no es válida.");
    return "";
  }

  try {
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    console.error("Error formateando la fecha:", error);
    return "";
  }
};

/**
 * Verifica si dos fechas corresponden al mismo día (año, mes, día).
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};
