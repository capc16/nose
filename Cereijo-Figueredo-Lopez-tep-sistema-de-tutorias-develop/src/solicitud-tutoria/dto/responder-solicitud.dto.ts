import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoSolicitud } from '../entities/solicitud-tutoria.entity';

export class ResponderSolicitudDto {
  @IsEnum(EstadoSolicitud)
  estado: EstadoSolicitud.ACEPTADA | EstadoSolicitud.RECHAZADA;

  @IsOptional()
  @IsString()
  comentario_tutor!: string;
}