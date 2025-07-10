import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';
import { Materia } from '../../materia/entities/materia.entity';

@Entity('tutor')
export class Tutor {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id' })
  usuario: Usuario;

  @Column({ length: 20, unique: true })
  cedula: string;

  @Column({ length: 100 })
  profesion: string;

  @Column('text')
  experiencia: string;

  @Column({ length: 20 })
  telefono: string;

  @ManyToOne(() => Materia, { nullable: true })
  @JoinColumn({ name: 'materia_id' })
  materia: Materia | null;
}
