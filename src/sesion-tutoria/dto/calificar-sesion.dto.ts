import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CalificarSesionDto {
  @IsInt()
  @Min(1, { message: 'La calificación mínima es 1' })
  @Max(5, { message: 'La calificación máxima es 5' })
  calificacion: number;

  @IsOptional()
  @IsString()
  comentario_estudiante?: string;
}