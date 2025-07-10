import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudTutoria } from './entities/solicitud-tutoria.entity';
import { SolicitudTutoriaService } from './solicitud-tutoria.service';
import { SolicitudTutoriaController } from './solicitud-tutoria.controller';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Materia } from '../materia/entities/materia.entity';
import { SesionTutoriaModule } from '../sesion-tutoria/sesion-tutoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitudTutoria, Estudiante, Tutor, Materia]),
    forwardRef(() => SesionTutoriaModule),
  ],
  providers: [SolicitudTutoriaService],
  controllers: [SolicitudTutoriaController],
  exports: [SolicitudTutoriaService],
})
export class SolicitudTutoriaModule {}