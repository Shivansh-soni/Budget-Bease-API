import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // Skip validation if no DTO is provided
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert plain JS object to class instance for validation
    const object = plainToInstance(metatype, value, {
      enableImplicitConversion: true,
    });

    // Validate the object
    const errors = await validate(object, {
      whitelist: true, // Strip away any properties that don't have any decorators
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      transformOptions: {
        enableImplicitConversion: true, // Convert string query parameters to their corresponding types
      },
    });

    // If there are validation errors, format them and throw
    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      const errorResponse = new ApiResponseDto<null>({
        success: false,
        error: 'Validation failed',
      });

      throw new BadRequestException({
        ...errorResponse,
        errors: formattedErrors,
      });
    }

    return object;
  }

  // Helper method to check if the type is a built-in type
  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  // Format validation errors into a more readable format
  private formatErrors(errors: any[]) {
    return errors.map(error => {
      const constraints = error.constraints || {};
      const property = error.property;
      const messages = Object.values(constraints);

      // Handle nested validation errors
      if (error.children && error.children.length > 0) {
        const children = this.formatErrors(error.children);
        return { property, messages, children };
      }

      return { property, messages };
    });
  }
}
