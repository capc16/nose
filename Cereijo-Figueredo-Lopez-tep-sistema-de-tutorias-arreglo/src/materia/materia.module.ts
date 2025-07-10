import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './entities/materia.entity';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Materia])],
  providers: [MateriaService],
  controllers: [MateriaController],
  exports: [MateriaService],
})
export class MateriaModule {}