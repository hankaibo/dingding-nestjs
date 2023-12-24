import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: {
    data: T[];
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        if (Array.isArray(res.data)) {
          res.data.forEach((item) => {
            item.workDate = this.transformTime(item.workDate);
          });
        }
        return res;
      }),
    );
  }

  private transformTime(date: string): string {
    const d = new Date(date);
    d.setHours(d.getHours() + 8);
    return d.toISOString().slice(0, 10);
  }
}
