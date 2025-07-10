import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Tutor } from '../../tutor/entities/tutor.entity';
import { Materia } from '../../materia/entities/materia.entity';

export enum EstadoSolicitud {
  PENDIENTE = 'pendiente',
  ACEPTADA = 'aceptada',
  RECHAZADA = 'rechazada',
}

@Entity('solicitud_tutoria')
export class SolicitudTutoria {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Estudiante, { nullable: false })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @Column({ name: 'estudiante_id' })
  estudianteId: number;

  @ManyToOne(() => Tutor, { nullable: false })
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @Column({ name: 'tutor_id' })
  tutorId: number;

  @ManyToOne(() => Materia, { nullable: false })
  @JoinColumn({ name: 'materia_id' })
  materia: Materia;

  @Column({ name: 'materia_id' })
  materiaId: number;

  @Column({ type: 'date' })
  fecha_deseada: Date;

  @Column({ type: 'time' })
  hora_deseada: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: EstadoSolicitud,
    default: EstadoSolicitud.PENDIENTE,
  })
  estado: EstadoSolicitud;

  @Column({ type: 'text', nullable: true })
  comentario_tutor: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}