import { IsOptional, IsInt, IsDateString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { EstadoSesion } from '../../sesion-tutoria/entities/sesion-tutoria.entity';

export class FiltrosSesionesDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  tutor_id?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  materia_id?: number;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsEnum(EstadoSesion)
  estado?: EstadoSesion;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}