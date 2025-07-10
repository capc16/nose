@@ .. @@
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
-import { Repository } from 'typeorm';
+import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Coordinador } from './entities/coordinador.entity';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';
+import { FiltrosSesionesDto } from './dto/filtros-sesiones.dto';
+import { 
+  EstadisticasCompletasDto, 
+  EstadisticasTutorDto, 
+  EstadisticasMateriaDto,
+  EstadisticasGeneralesDto 
+} from './dto/estadisticas-response.dto';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../users/entities/usuario.entity';
+import { SesionTutoria } from '../sesion-tutoria/entities/sesion-tutoria.entity';
+import { Tutor } from '../tutor/entities/tutor.entity';
+import { Estudiante } from '../estudiante/entities/estudiante.entity';
+import { Materia } from '../materia/entities/materia.entity';

@Injectable()
export class CoordinadorService {
  constructor(
    @InjectRepository(Coordinador)
    private coordinadorRepo: Repository<Coordinador>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
+
+    @InjectRepository(SesionTutoria)
+    private sesionRepo: Repository<SesionTutoria>,
+
+    @InjectRepository(Tutor)
+    private tutorRepo: Repository<Tutor>,
+
+    @InjectRepository(Estudiante)
+    private estudianteRepo: Repository<Estudiante>,
+
+    @InjectRepository(Materia)
+    private materiaRepo: Repository<Materia>,
  ) {}

  async create(dto: CreateCoordinadorDto): Promise<Coordinador> {
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

    const coordinador = this.coordinadorRepo.create({
      id: savedUser.id,
      cedula: dto.cedula,
      departamento: dto.departamento,
      extension_interna: dto.extension_interna,
    });

    return this.coordinadorRepo.save(coordinador);
  }

  async obtenerPerfil(usuarioId: number): Promise<Coordinador> {
    const coordinador = await this.coordinadorRepo.findOne({
      where: { id: usuarioId },
      relations: ['usuario'],
    });

    if (!coordinador) {
      throw new NotFoundException('Coordinador no encontrado');
    }

    const { contraseña, ...usuarioSinClave } = coordinador.usuario as any;
    return {
      ...coordinador,
      usuario: usuarioSinClave,
    };
  }

  async actualizarPerfil(
    usuarioId: number,
    dto: UpdateCoordinadorDto,
  ): Promise<Coordinador> {
    const coordinador = await this.coordinadorRepo.findOneBy({ id: usuarioId });
    if (!coordinador) {
      throw new NotFoundException('Coordinador no encontrado');
    }

    this.coordinadorRepo.merge(coordinador, dto);
    return this.coordinadorRepo.save(coordinador);
  }

+  // 📊 Panel del Coordinador - Obtener todas las sesiones con filtros
+  async obtenerTodasLasSesiones(filtros: FiltrosSesionesDto) {
+    const queryBuilder = this.sesionRepo.createQueryBuilder('sesion')
+      .leftJoinAndSelect('sesion.estudiante', 'estudiante')
+      .leftJoinAndSelect('estudiante.usuario', 'estudianteUsuario')
+      .leftJoinAndSelect('sesion.tutor', 'tutor')
+      .leftJoinAndSelect('tutor.usuario', 'tutorUsuario')
+      .leftJoinAndSelect('sesion.materia', 'materia')
+      .leftJoinAndSelect('sesion.solicitud', 'solicitud');
+
+    // Aplicar filtros
+    if (filtros.tutor_id) {
+      queryBuilder.andWhere('sesion.tutorId = :tutorId', { tutorId: filtros.tutor_id });
+    }
+
+    if (filtros.materia_id) {
+      queryBuilder.andWhere('sesion.materiaId = :materiaId', { materiaId: filtros.materia_id });
+    }
+
+    if (filtros.estado) {
+      queryBuilder.andWhere('sesion.estado = :estado', { estado: filtros.estado });
+    }
+
+    if (filtros.fecha_inicio && filtros.fecha_fin) {
+      queryBuilder.andWhere('sesion.fecha BETWEEN :fechaInicio AND :fechaFin', {
+        fechaInicio: filtros.fecha_inicio,
+        fechaFin: filtros.fecha_fin,
+      });
+    } else if (filtros.fecha_inicio) {
+      queryBuilder.andWhere('sesion.fecha >= :fechaInicio', { fechaInicio: filtros.fecha_inicio });
+    } else if (filtros.fecha_fin) {
+      queryBuilder.andWhere('sesion.fecha <= :fechaFin', { fechaFin: filtros.fecha_fin });
+    }
+
+    // Ordenar por fecha más reciente
+    queryBuilder.orderBy('sesion.fecha', 'DESC').addOrderBy('sesion.hora', 'DESC');
+
+    // Paginación
+    const page = filtros.page || 1;
+    const limit = filtros.limit || 10;
+    const skip = (page - 1) * limit;
+
+    queryBuilder.skip(skip).take(limit);
+
+    const [sesiones, total] = await queryBuilder.getManyAndCount();
+
+    return {
+      data: sesiones,
+      pagination: {
+        page,
+        limit,
+        total,
+        totalPages: Math.ceil(total / limit),
+      },
+    };
+  }
+
+  // 📈 Estadísticas completas
+  async obtenerEstadisticas(): Promise<EstadisticasCompletasDto> {
+    const [generales, porTutor, porMateria] = await Promise.all([
+      this.obtenerEstadisticasGenerales(),
+      this.obtenerEstadisticasTutores(),
+      this.obtenerEstadisticasMaterias(),
+    ]);
+
+    return {
+      generales,
+      por_tutor: porTutor,
+      por_materia: porMateria,
+    };
+  }
+
+  // 📊 Estadísticas generales
+  private async obtenerEstadisticasGenerales(): Promise<EstadisticasGeneralesDto> {
+    // Conteos básicos
+    const [
+      totalSesiones,
+      sesionesCompletadas,
+      sesionesAgendadas,
+      sesionesCanceladas,
+      totalTutores,
+      totalEstudiantes,
+      totalMaterias,
+    ] = await Promise.all([
+      this.sesionRepo.count(),
+      this.sesionRepo.count({ where: { estado: 'completada' } }),
+      this.sesionRepo.count({ where: { estado: 'agendada' } }),
+      this.sesionRepo.count({ where: { estado: 'cancelada' } }),
+      this.tutorRepo.count(),
+      this.estudianteRepo.count(),
+      this.materiaRepo.count(),
+    ]);
+
+    // Calificación promedio general
+    const calificacionPromedio = await this.sesionRepo
+      .createQueryBuilder('sesion')
+      .select('AVG(sesion.calificacion)', 'promedio')
+      .where('sesion.calificacion IS NOT NULL')
+      .getRawOne();
+
+    // Sesiones por mes (últimos 12 meses)
+    const sesionePorMes = await this.sesionRepo
+      .createQueryBuilder('sesion')
+      .select([
+        "TO_CHAR(sesion.fecha, 'YYYY-MM') as mes",
+        'COUNT(*) as total',
+        "COUNT(CASE WHEN sesion.estado = 'completada' THEN 1 END) as completadas",
+      ])
+      .where('sesion.fecha >= :fechaInicio', {
+        fechaInicio: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Último año
+      })
+      .groupBy("TO_CHAR(sesion.fecha, 'YYYY-MM')")
+      .orderBy('mes', 'DESC')
+      .limit(12)
+      .getRawMany();
+
+    return {
+      total_sesiones: totalSesiones,
+      sesiones_completadas: sesionesCompletadas,
+      sesiones_agendadas: sesionesAgendadas,
+      sesiones_canceladas: sesionesCanceladas,
+      total_tutores_activos: totalTutores,
+      total_estudiantes_activos: totalEstudiantes,
+      total_materias: totalMaterias,
+      calificacion_promedio_general: calificacionPromedio?.promedio 
+        ? parseFloat(parseFloat(calificacionPromedio.promedio).toFixed(2))
+        : null,
+      sesiones_por_mes: sesionePorMes.map(item => ({
+        mes: item.mes,
+        total: parseInt(item.total),
+        completadas: parseInt(item.completadas),
+      })),
+    };
+  }
+
+  // 👨‍🏫 Estadísticas por tutor
+  async obtenerEstadisticasTutores(): Promise<EstadisticasTutorDto[]> {
+    const estadisticas = await this.sesionRepo
+      .createQueryBuilder('sesion')
+      .leftJoin('sesion.tutor', 'tutor')
+      .leftJoin('tutor.usuario', 'tutorUsuario')
+      .leftJoin('tutor.materia', 'materia')
+      .select([
+        'tutor.id as tutor_id',
+        'tutorUsuario.nombre as tutor_nombre',
+        'tutor.profesion as tutor_profesion',
+        'materia.nombre as materia_nombre',
+        'COUNT(*) as total_sesiones',
+        "COUNT(CASE WHEN sesion.estado = 'completada' THEN 1 END) as sesiones_completadas",
+        "COUNT(CASE WHEN sesion.estado = 'agendada' THEN 1 END) as sesiones_agendadas",
+        "COUNT(CASE WHEN sesion.estado = 'cancelada' THEN 1 END) as sesiones_canceladas",
+        'AVG(sesion.calificacion) as calificacion_promedio',
+        'COUNT(DISTINCT sesion.estudianteId) as total_estudiantes_atendidos',
+      ])
+      .groupBy('tutor.id, tutorUsuario.nombre, tutor.profesion, materia.nombre')
+      .orderBy('total_sesiones', 'DESC')
+      .getRawMany();
+
+    return estadisticas.map(item => ({
+      tutor_id: parseInt(item.tutor_id),
+      tutor_nombre: item.tutor_nombre,
+      tutor_profesion: item.tutor_profesion,
+      materia_nombre: item.materia_nombre || 'Sin materia asignada',
+      total_sesiones: parseInt(item.total_sesiones),
+      sesiones_completadas: parseInt(item.sesiones_completadas),
+      sesiones_agendadas: parseInt(item.sesiones_agendadas),
+      sesiones_canceladas: parseInt(item.sesiones_canceladas),
+      calificacion_promedio: item.calificacion_promedio 
+        ? parseFloat(parseFloat(item.calificacion_promedio).toFixed(2))
+        : null,
+      total_estudiantes_atendidos: parseInt(item.total_estudiantes_atendidos),
+    }));
+  }
+
+  // 📚 Estadísticas por materia
+  async obtenerEstadisticasMaterias(): Promise<EstadisticasMateriaDto[]> {
+    const estadisticas = await this.sesionRepo
+      .createQueryBuilder('sesion')
+      .leftJoin('sesion.materia', 'materia')
+      .select([
+        'materia.id as materia_id',
+        'materia.nombre as materia_nombre',
+        'materia.codigo as materia_codigo',
+        'COUNT(*) as total_sesiones',
+        "COUNT(CASE WHEN sesion.estado = 'completada' THEN 1 END) as sesiones_completadas",
+        "COUNT(CASE WHEN sesion.estado = 'agendada' THEN 1 END) as sesiones_agendadas",
+        "COUNT(CASE WHEN sesion.estado = 'cancelada' THEN 1 END) as sesiones_canceladas",
+        'COUNT(DISTINCT sesion.tutorId) as total_tutores',
+        'COUNT(DISTINCT sesion.estudianteId) as total_estudiantes',
+        'AVG(sesion.calificacion) as calificacion_promedio',
+      ])
+      .groupBy('materia.id, materia.nombre, materia.codigo')
+      .orderBy('total_sesiones', 'DESC')
+      .getRawMany();
+
+    return estadisticas.map(item => ({
+      materia_id: parseInt(item.materia_id),
+      materia_nombre: item.materia_nombre,
+      materia_codigo: item.materia_codigo,
+      total_sesiones: parseInt(item.total_sesiones),
+      sesiones_completadas: parseInt(item.sesiones_completadas),
+      sesiones_agendadas: parseInt(item.sesiones_agendadas),
+      sesiones_canceladas: parseInt(item.sesiones_canceladas),
+      total_tutores: parseInt(item.total_tutores),
+      total_estudiantes: parseInt(item.total_estudiantes),
+      calificacion_promedio: item.calificacion_promedio 
+        ? parseFloat(parseFloat(item.calificacion_promedio).toFixed(2))
+        : null,
+    }));
+  }
}