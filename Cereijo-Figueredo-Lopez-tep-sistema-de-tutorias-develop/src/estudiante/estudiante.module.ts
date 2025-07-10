import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from './entities/estudiante.entity';
import { Usuario } from '../users/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante, Usuario]) 
  ],
  controllers: [EstudianteController], 
  providers: [EstudianteService], 
  exports: [EstudianteService], 
})
export class EstudianteModule {}
