import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, MoreThanOrEqual } from 'typeorm';
import { SesionTutoria, EstadoSesion } from './entities/sesion-tutoria.entity';
import { CreateSesionTutoriaDto } from './dto/create-sesion-tutoria.dto';
import { CompletarSesionDto } from './dto/completar-sesion.dto';
import { CalificarSesionDto } from './dto/calificar-sesion.dto';
import { SolicitudTutoria } from '../solicitud-tutoria/entities/solicitud-tutoria.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Materia } from '../materia/entities/materia.entity';

@Injectable()
export class SesionTutoriaService {
  constructor(
    @InjectRepository(SesionTutoria)
    private sesionRepo: Repository<SesionTutoria>,
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Tutor)
    private tutorRepo: Repository<Tutor>,
    @InjectRepository(Materia)
    private materiaRepo: Repository<Materia>,
  ) {}

  async createFromSolicitud(solicitud: SolicitudTutoria): Promise<SesionTutoria> {
    const sesion = this.sesionRepo.create({
      estudianteId: solicitud.estudianteId,
      tutorId: solicitud.tutorId,
      materiaId: solicitud.materiaId,
      solicitudId: solicitud.id,
      fecha: solicitud.fecha_deseada,
      hora: solicitud.hora_deseada,
      descripcion: solicitud.descripcion,
      estado: EstadoSesion.AGENDADA,
    });

    return this.sesionRepo.save(sesion);
  }

  async create(tutorId: number, dto: CreateSesionTutoriaDto): Promise<SesionTutoria> {
    // Verificar que el estudiante existe
    const estudiante = await this.estudianteRepo.findOneBy({ id: dto.estudiante_id });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Verificar que el tutor existe y tiene asignada la materia
    const tutor = await this.tutorRepo.findOne({
      where: { id: tutorId },
      relations: ['materia'],
    });
    if (!tutor) {
      throw new NotFoundException('Tutor no encontrado');
    }

    // Verificar que la materia existe
    const materia = await this.materiaRepo.findOneBy({ id: dto.materia_id });
    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    // Verificar que el tutor puede enseñar esa materia
    if (!tutor.materia || tutor.materia.id !== dto.materia_id) {
      throw new BadRequestException('No estás asignado a esta materia');
    }

    const sesion = this.sesionRepo.create({
      estudianteId: dto.estudiante_id,
      tutorId,
      materiaId: dto.materia_id,
      fecha: new Date(dto.fecha),
      hora: dto.hora,
      descripcion: dto.descripcion,
    });

    return this.sesionRepo.save(sesion);
  }

  async findByEstudiante(estudianteId: number): Promise<{
    futuras: SesionTutoria[];
    pasadas: SesionTutoria[];
  }> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const [futuras, pasadas] = await Promise.all([
      this.sesionRepo.find({
        where: {
          estudianteId,
          fecha: MoreThanOrEqual(hoy),
          estado: EstadoSesion.AGENDADA,
        },
        relations: ['tutor', 'tutor.usuario', 'materia'],
        order: { fecha: 'ASC', hora: 'ASC' },
      }),
      this.sesionRepo.find({
        where: [
          {
            estudianteId,
            fecha: LessThan(hoy),
          },
          {
            estudianteId,
            estado: EstadoSesion.COMPLETADA,
          },
        ],
        relations: ['tutor', 'tutor.usuario', 'materia'],
        order: { fecha: 'DESC', hora: 'DESC' },
      }),
    ]);

    return { futuras, pasadas };
  }

  async findByTutor(tutorId: number): Promise<{
    futuras: SesionTutoria[];
    pasadas: SesionTutoria[];
  }> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const [futuras, pasadas] = await Promise.all([
      this.sesionRepo.find({
        where: {
          tutorId,
          fecha: MoreThanOrEqual(hoy),
          estado: EstadoSesion.AGENDADA,
        },
        relations: ['estudiante', 'estudiante.usuario', 'materia'],
        order: { fecha: 'ASC', hora: 'ASC' },
      }),
      this.sesionRepo.find({
        where: [
          {
            tutorId,
            fecha: LessThan(hoy),
          },
          {
            tutorId,
            estado: EstadoSesion.COMPLETADA,
          },
        ],
        relations: ['estudiante', 'estudiante.usuario', 'materia'],
        order: { fecha: 'DESC', hora: 'DESC' },
      }),
    ]);

    return { futuras, pasadas };
  }

  async completarSesion(
    sesionId: number,
    tutorId: number,
    dto: CompletarSesionDto,
  ): Promise<SesionTutoria> {
    const sesion = await this.sesionRepo.findOne({
      where: { id: sesionId },
      relations: ['tutor', 'estudiante', 'materia'],
    });

    if (!sesion) {
      throw new NotFoundException('Sesión no encontrada');
    }

    if (sesion.tutorId !== tutorId) {
      throw new ForbiddenException('No tienes permisos para completar esta sesión');
    }

    if (sesion.estado !== EstadoSesion.AGENDADA) {
      throw new BadRequestException('Esta sesión ya ha sido completada o cancelada');
    }

    sesion.estado = EstadoSesion.COMPLETADA;
    sesion.notas_tutor = dto.notas_tutor;

    return this.sesionRepo.save(sesion);
  }

  async calificarSesion(
    sesionId: number,
    estudianteId: number,
    dto: CalificarSesionDto,
  ): Promise<SesionTutoria> {
    const sesion = await this.sesionRepo.findOne({
      where: { id: sesionId },
      relations: ['tutor', 'tutor.usuario', 'estudiante', 'materia'],
    });

    if (!sesion) {
      throw new NotFoundException('Sesión no encontrada');
    }

    if (sesion.estudianteId !== estudianteId) {
      throw new ForbiddenException('No tienes permisos para calificar esta sesión');
    }

    if (sesion.estado !== EstadoSesion.COMPLETADA) {
      throw new BadRequestException('Solo se pueden calificar sesiones completadas');
    }

    if (sesion.calificacion !== null) {
      throw new BadRequestException('Esta sesión ya ha sido calificada');
    }

    sesion.calificacion = dto.calificacion;
    sesion.comentario_estudiante = dto.comentario_estudiante;

    return this.sesionRepo.save(sesion);
  }

  async findById(id: number): Promise<SesionTutoria> {
    const sesion = await this.sesionRepo.findOne({
      where: { id },
      relations: ['estudiante', 'estudiante.usuario', 'tutor', 'tutor.usuario', 'materia'],
    });

    if (!sesion) {
      throw new NotFoundException('Sesión no encontrada');
    }

    return sesion;
  }
}