import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinadorService } from './coordinador.service';
import { CoordinadorController } from './coordinador.controller';
import { Coordinador } from './entities/coordinador.entity';
import { Usuario } from '../users/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coordinador, Usuario])],
  providers: [CoordinadorService],
  controllers: [CoordinadorController],
  exports:[CoordinadorService],
})
export class CoordinadorModule {}
