// /src/log/interceptors/logging.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from '../log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;

    return next.handle().pipe(
      tap(() => {
        const userId = request.user?.id || null;

        const action = `Petición a la ruta: ${path}`;
        
        this.logService.createLog({
          usuarioId: userId,
          accion: action,
          ruta: path,
          metodo: method,
        });
      }),
    );
  }
}