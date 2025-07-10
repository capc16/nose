import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Repository } from 'typeorm';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../users/entities/usuario.entity';
import { InjectRepository as InjectUsuarioRepository } from '@nestjs/typeorm';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectUsuarioRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepo: Repository<Estudiante>,
  ) {}

  async create(dto: CreateEstudianteDto): Promise<Estudiante> {
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

    const estudiante = this.estudianteRepo.create({
      id: savedUser.id,
      cedula: dto.cedula,
      carrera: dto.carrera,
      semestre: dto.semestre,
      telefono: dto.telefono,
    });
    return this.estudianteRepo.save(estudiante);
  }

  async obtenerPerfil(usuarioId: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepo.findOne({
      where: { id: usuarioId },
      relations: ['usuario'],
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Omitir contraseña al devolver usuario
    const { contraseña, ...usuarioSinClave } = estudiante.usuario as any;

    return {
      ...estudiante,
      usuario: usuarioSinClave,
    };
  }
  async actualizarPerfil(usuarioId: number, dto: UpdateEstudianteDto) {
  const estudiante = await this.estudianteRepo.findOneBy({ id: usuarioId });
  if (!estudiante) throw new NotFoundException('Estudiante no encontrado');

  // Actualizar datos del estudiante
  this.estudianteRepo.merge(estudiante, dto);
  return this.estudianteRepo.save(estudiante);
}
}
