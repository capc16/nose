import { IsNotEmpty, IsInt, IsDateString, IsString, IsOptional, Matches } from 'class-validator';

export class CreateSesionTutoriaDto {
  @IsNotEmpty()
  @IsInt()
  estudiante_id: number;

  @IsNotEmpty()
  @IsInt()
  materia_id: number;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe estar en formato HH:MM (24 horas)',
  })
  hora: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}