import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { LogService } from './log.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LogService],
  // Exportamos LogService para que esté disponible para inyección
  // de dependencias en otros módulos (como el interceptor global).
  exports: [LogService],
})
export class LogModule {}