import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the response is already an instance of ApiResponseDto, return it as is
        if (data instanceof ApiResponseDto) {
          return data;
        }

        // If it's a paginated response, format it accordingly
        if (data && typeof data === 'object' && 'items' in data && 'total' in data) {
          return new ApiResponseDto({
            success: true,
            data,
          });
        }

        // For single resource responses
        return new ApiResponseDto({
          success: true,
          data,
        });
      }),
    );
  }
}
