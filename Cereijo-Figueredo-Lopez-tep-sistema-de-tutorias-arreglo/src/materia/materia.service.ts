import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from './entities/materia.entity';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';

@Injectable()
export class MateriaService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepo: Repository<Materia>,
  ) {}

  findAll() {
    return this.materiaRepo.find();
  }

  create(dto: CreateMateriaDto) {
    const materia = this.materiaRepo.create(dto);
    return this.materiaRepo.save(materia);
  }

  async update(id: number, dto: UpdateMateriaDto) {
    const materia = await this.materiaRepo.findOneBy({ id });
    if (!materia) throw new NotFoundException('Materia no encontrada');

    Object.assign(materia, dto);
    return this.materiaRepo.save(materia);
  }
}
