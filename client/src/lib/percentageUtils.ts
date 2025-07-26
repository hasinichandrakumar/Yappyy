// Utility functions to ensure percentages never display as NaN

/**
 * Safely formats a number as a percentage, ensuring it never returns NaN%
 * @param value - The value to format as percentage (can be null/undefined/NaN)
 * @param defaultValue - Default value to use if input is invalid (default: 0)
 * @returns A string like "75%" or "0%" (never "NaN%")
 */
export function safePercentage(value: number | null | undefined, defaultValue: number = 0): string {
  const numValue = Number(value);
  if (isNaN(numValue) || value === null || value === undefined) {
    return `${defaultValue}%`;
  }
  return `${Math.round(numValue)}%`;
}

/**
 * Safely rounds a number, ensuring it never returns NaN
 * @param value - The value to round
 * @param defaultValue - Default value to use if input is invalid (default: 0)
 * @returns A rounded number (never NaN)
 */
export function safeRound(value: number | null | undefined, defaultValue: number = 0): number {
  const numValue = Number(value);
  if (isNaN(numValue) || value === null || value === undefined) {
    return defaultValue;
  }
  return Math.round(numValue);
}

/**
 * Safely formats a decimal as a percentage (e.g., 0.75 → "75%")
 * @param value - The decimal value (0-1 range)
 * @param defaultValue - Default value to use if input is invalid (default: 0)
 * @returns A string like "75%" or "0%" (never "NaN%")
 */
export function safeDecimalToPercentage(value: number | null | undefined, defaultValue: number = 0): string {
  const numValue = Number(value);
  if (isNaN(numValue) || value === null || value === undefined) {
    return `${defaultValue}%`;
  }
  return `${Math.round(numValue * 100)}%`;
}

/**
 * Safely gets a numeric value for calculations, ensuring it's never NaN
 * @param value - The value to process
 * @param defaultValue - Default value to use if input is invalid (default: 0)
 * @returns A number (never NaN)
 */
export function safeNumber(value: number | null | undefined, defaultValue: number = 0): number {
  const numValue = Number(value);
  if (isNaN(numValue) || value === null || value === undefined) {
    return defaultValue;
  }
  return numValue;
}

/**
 * Safely calculates confidence score for display
 * @param score - The confidence score (usually 0-1 or 0-100)
 * @param isDecimal - Whether the input is a decimal (0-1) or percentage (0-100)
 * @returns A formatted percentage string
 */
export function safeConfidenceScore(score: number | null | undefined, isDecimal: boolean = true): string {
  if (isDecimal) {
    return safeDecimalToPercentage(score);
  }
  return safePercentage(score);
}