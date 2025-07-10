import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutor } from './entities/tutor.entity';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../users/entities/usuario.entity';
import { Materia } from '../materia/entities/materia.entity';
import { AsignarMateriaDto } from './dto/asignar-materia.dto';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(Tutor)
    private tutorRepo: Repository<Tutor>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,

    @InjectRepository(Materia)
    private materiaRepo: Repository<Materia>,
  ) {}

  async create(dto: CreateTutorDto): Promise<Tutor> {
    const existe = await this.usuarioRepo.findOne({ where: { correo: dto.correo } });
    if (existe) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const hash = await bcrypt.hash(dto.contraseña, 10);

    const usuario = this.usuarioRepo.create({
      nombre: dto.nombre,
      correo: dto.correo,
      contraseña: hash,
    });
    const savedUser = await this.usuarioRepo.save(usuario);

    let materia: Materia | null = null;
    if (dto.materia_id) {
      materia = await this.materiaRepo.findOne({ where: { id: dto.materia_id } });
      if (!materia) throw new NotFoundException('Materia no encontrada');
    }

    const tutor = this.tutorRepo.create({
      id: savedUser.id,
      cedula: dto.cedula,
      profesion: dto.profesion,
      experiencia: dto.experiencia,
      telefono: dto.telefono,
      materia: materia,
    });

    return this.tutorRepo.save(tutor);
  }

  async obtenerPerfil(usuarioId: number): Promise<Tutor> {
    const tutor = await this.tutorRepo.findOne({
      where: { id: usuarioId },
      relations: ['usuario', 'materia'],
    });

    if (!tutor) {
      throw new NotFoundException('Tutor no encontrado');
    }

    const { contraseña, ...usuarioSinClave } = tutor.usuario as any;
    return {
      ...tutor,
      usuario: usuarioSinClave,
    };
  }

  async actualizarPerfil(usuarioId: number, dto: UpdateTutorDto): Promise<Tutor> {
    const tutor = await this.tutorRepo.findOne({
      where: { id: usuarioId },
      relations: ['materia'],
    });

    if (!tutor) {
      throw new NotFoundException('Tutor no encontrado');
    }

    if (dto.materia_id) {
      const materia = await this.materiaRepo.findOne({ where: { id: dto.materia_id } });
      if (!materia) throw new NotFoundException('Materia no encontrada');
      tutor.materia = materia;
    }

    this.tutorRepo.merge(tutor, dto);
    return this.tutorRepo.save(tutor);
  }
  
  async asignarMateria(tutorId: number, dto: AsignarMateriaDto): Promise<Tutor> {
  const tutor = await this.tutorRepo.findOne({
    where: { id: tutorId },
    relations: ['materia'],
  });

  if (!tutor) {
    throw new NotFoundException('Tutor no encontrado');
  }

  const materia = await this.materiaRepo.findOne({ where: { id: dto.materia_id } });
  if (!materia) {
    throw new NotFoundException('Materia no encontrada');
  }

  tutor.materia = materia;
  return this.tutorRepo.save(tutor);
  }

}
