import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  // Buscar por correo (para login)
  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { correo } });
  }

  // Obtener rol del usuario según su presencia en las tablas de tipo
  async obtenerRol(usuarioId: number): Promise<'estudiante' | 'tutor' | 'coordinador' | 'desconocido'> {
    const [estudiante, tutor, coordinador] = await Promise.all([
      this.usuarioRepo.query(`SELECT 1 FROM estudiante WHERE id = $1 LIMIT 1`, [usuarioId]),
      this.usuarioRepo.query(`SELECT 1 FROM tutor WHERE id = $1 LIMIT 1`, [usuarioId]),
      this.usuarioRepo.query(`SELECT 1 FROM coordinador WHERE id = $1 LIMIT 1`, [usuarioId]),
    ]);

    if (estudiante.length > 0) return 'estudiante';
    if (tutor.length > 0) return 'tutor';
    if (coordinador.length > 0) return 'coordinador';
    return 'desconocido';
  }

  // Obtener todos los usuarios (más útil para admin o pruebas)
  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find();
  }

  // Obtener un usuario por su ID
  async findById(id: number): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { id } });
  }

}
