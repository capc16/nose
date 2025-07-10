import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Tutor } from '../../tutor/entities/tutor.entity';
import { Materia } from '../../materia/entities/materia.entity';
import { SolicitudTutoria } from '../../solicitud-tutoria/entities/solicitud-tutoria.entity';

export enum EstadoSesion {
  AGENDADA = 'agendada',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

@Entity('sesion_tutoria')
export class SesionTutoria {
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

  @OneToOne(() => SolicitudTutoria, { nullable: true })
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: SolicitudTutoria;

  @Column({ name: 'solicitud_id', nullable: true })
  solicitudId: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: EstadoSesion,
    default: EstadoSesion.AGENDADA,
  })
  estado: EstadoSesion;

  @Column({ type: 'text', nullable: true })
  notas_tutor: string;

  @Column({ type: 'int', nullable: true, comment: 'Calificación del 1 al 5' })
  calificacion: number;

  @Column({ type: 'text', nullable: true })
  comentario_estudiante: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}