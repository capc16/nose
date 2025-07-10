@@ .. @@
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinadorService } from './coordinador.service';
import { CoordinadorController } from './coordinador.controller';
import { Coordinador } from './entities/coordinador.entity';
import { Usuario } from '../users/entities/usuario.entity';
+import { SesionTutoria } from '../sesion-tutoria/entities/sesion-tutoria.entity';
+import { Tutor } from '../tutor/entities/tutor.entity';
+import { Estudiante } from '../estudiante/entities/estudiante.entity';
+import { Materia } from '../materia/entities/materia.entity';

@Module({
-  imports: [TypeOrmModule.forFeature([Coordinador, Usuario])],
+  imports: [TypeOrmModule.forFeature([Coordinador, Usuario, SesionTutoria, Tutor, Estudiante, Materia])],
  providers: [CoordinadorService],
  controllers: [CoordinadorController],
  exports:[CoordinadorService],
})
export class CoordinadorModule {}