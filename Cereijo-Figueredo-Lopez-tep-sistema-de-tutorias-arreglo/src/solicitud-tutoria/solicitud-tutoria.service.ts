import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudTutoria, EstadoSolicitud } from './entities/solicitud-tutoria.entity';
import { CreateSolicitudTutoriaDto } from './dto/create-solicitud-tutoria.dto';
import { ResponderSolicitudDto } from './dto/responder-solicitud.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Materia } from '../materia/entities/materia.entity';
import { SesionTutoriaService } from '../sesion-tutoria/sesion-tutoria.service';

@Injectable()
export class SolicitudTutoriaService {
  constructor(
    @InjectRepository(SolicitudTutoria)
    private solicitudRepo: Repository<SolicitudTutoria>,
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Tutor)
    private tutorRepo: Repository<Tutor>,
    @InjectRepository(Materia)
    private materiaRepo: Repository<Materia>,
    private sesionTutoriaService: SesionTutoriaService,
  ) {}

  async create(estudianteId: number, dto: CreateSolicitudTutoriaDto): Promise<SolicitudTutoria> {
    // Verificar que el estudiante existe
    const estudiante = await this.estudianteRepo.findOneBy({ id: estudianteId });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Verificar que el tutor existe y tiene asignada la materia
    const tutor = await this.tutorRepo.findOne({
      where: { id: dto.tutor_id },
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
      throw new BadRequestException('El tutor no está asignado a esta materia');
    }

    // Verificar que la fecha no sea en el pasado
    const fechaDeseada = new Date(dto.fecha_deseada);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaDeseada < hoy) {
      throw new BadRequestException('No se puede solicitar tutoría para fechas pasadas');
    }

    const solicitud = this.solicitudRepo.create({
      estudianteId,
      tutorId: dto.tutor_id,
      materiaId: dto.materia_id,
      fecha_deseada: fechaDeseada,
      hora_deseada: dto.hora_deseada,
      descripcion: dto.descripcion,
      estado: EstadoSolicitud.PENDIENTE,
    });

    return this.solicitudRepo.save(solicitud);
  }

  async findByEstudiante(estudianteId: number): Promise<SolicitudTutoria[]> {
    return this.solicitudRepo.find({
      where: { estudianteId },
      relations: ['tutor', 'tutor.usuario', 'materia'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findByTutor(tutorId: number): Promise<SolicitudTutoria[]> {
    return this.solicitudRepo.find({
      where: { tutorId },
      relations: ['estudiante', 'estudiante.usuario', 'materia'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async responderSolicitud(
    solicitudId: number,
    tutorId: number,
    dto: ResponderSolicitudDto,
  ): Promise<SolicitudTutoria> {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id: solicitudId },
      relations: ['tutor', 'estudiante', 'materia'],
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.tutorId !== tutorId) {
      throw new ForbiddenException('No tienes permisos para responder esta solicitud');
    }

    if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
      throw new BadRequestException('Esta solicitud ya ha sido respondida');
    }

    // Actualizar estado y comentario
    solicitud.estado = dto.estado;
    solicitud.comentario_tutor = dto.comentario_tutor;

    const solicitudActualizada = await this.solicitudRepo.save(solicitud);

    // Crear sesión automáticamente si aceptada
    if (dto.estado === EstadoSolicitud.ACEPTADA) {
      await this.sesionTutoriaService.createFromSolicitud(solicitud);
    }

    return solicitudActualizada;
  }

  async findById(id: number): Promise<SolicitudTutoria> {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['estudiante', 'estudiante.usuario', 'tutor', 'tutor.usuario', 'materia'],
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return solicitud;
  }
}
