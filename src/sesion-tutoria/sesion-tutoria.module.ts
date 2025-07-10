import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionTutoria } from './entities/sesion-tutoria.entity';
import { SesionTutoriaService } from './sesion-tutoria.service';
import { SesionTutoriaController } from './sesion-tutoria.controller';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Materia } from '../materia/entities/materia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SesionTutoria, Estudiante, Tutor, Materia]),
  ],
  providers: [SesionTutoriaService],
  controllers: [SesionTutoriaController],
  exports: [SesionTutoriaService],
})
export class SesionTutoriaModule {}