import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity()
export class Estudiante {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id' }) 
  usuario: Usuario;

  @Column({ length: 20, unique: true })
  cedula: string;

  @Column({ length: 100 })
  carrera: string;

  @Column()
  semestre: number;

  @Column({ length: 20 })
  telefono: string;
}
