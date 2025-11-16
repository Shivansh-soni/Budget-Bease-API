/**
 * Converts an enum to an array of its values
 * @param enumObj - The enum to convert
 * @returns Array of enum values
 */
export function enumToArray<T>(enumObj: T): string[] {
  return Object.values(enumObj as object).filter(
    (value) => typeof value === 'string'
  ) as string[];
}

/**
 * Gets the description for an enum with its possible values
 * @param enumObj - The enum to describe
 * @param description - Base description
 * @returns Formatted description with possible values
 */
export function getEnumDescription<T>(
  enumObj: T,
  description: string
): string {
  const values = enumToArray(enumObj);
  return `${description} (Possible values: ${values.join(', ')})`;
}
