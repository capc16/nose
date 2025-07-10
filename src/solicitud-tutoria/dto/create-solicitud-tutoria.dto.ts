import { IsNotEmpty, IsInt, IsDateString, IsString, IsOptional, Matches } from 'class-validator';

export class CreateSolicitudTutoriaDto {
  @IsNotEmpty()
  @IsInt()
  tutor_id: number;

  @IsNotEmpty()
  @IsInt()
  materia_id: number;

  @IsNotEmpty()
  @IsDateString()
  fecha_deseada: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe estar en formato HH:MM (24 horas)',
  })
  hora_deseada: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}