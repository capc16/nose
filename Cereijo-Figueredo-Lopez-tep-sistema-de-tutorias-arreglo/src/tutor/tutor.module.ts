import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';
import { Tutor } from './entities/tutor.entity';
import { Usuario } from '../users/entities/usuario.entity';
import { Materia } from '../materia/entities/materia.entity'; 
import { MateriaModule } from '../materia/materia.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Tutor, Usuario, Materia]), 
    MateriaModule, 
  ],
  controllers: [TutorController],
  providers: [TutorService],
  exports: [TutorService],
})
export class TutorModule {}
