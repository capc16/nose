import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity('coordinador')
export class Coordinador {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id' })
  usuario: Usuario;

  @Column({ length: 20, unique: true })
  cedula: string;

  @Column({ length: 100 })
  departamento: string;

  @Column({ length: 20 })
  extension_interna: string;
}
