import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id', type: 'integer', nullable: true })
  usuarioId: number | null;

  @Column({ type: 'varchar', length: 100, nullable: false })
  accion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ruta: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  metodo: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.logs, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
