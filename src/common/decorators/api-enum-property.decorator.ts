import { ApiProperty } from '@nestjs/swagger';
import { enumToArray, getEnumDescription } from '../utils/enum.utils';

/**
 * Decorator to document an enum property in Swagger
 * @param enumType - The enum type
 * @param description - Description of the property
 * @param required - Whether the property is required
 * @param example - Example value (if not provided, first enum value is used)
 */
export function ApiEnumProperty<T>(
  enumType: T,
  description: string,
  required = true,
  example?: string
) {
  const values = enumToArray(enumType);

  return ApiProperty({
    description: getEnumDescription(enumType, description),
    enum: values,
    example: example || values[0],
    required,
  });
}
