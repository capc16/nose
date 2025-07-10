import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTutorDto {
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  correo: string;

  @MinLength(6)
  contraseña: string;

  @IsNotEmpty()
  cedula: string;

  @IsNotEmpty()
  profesion: string;

  @IsNotEmpty()
  experiencia: string;

  @IsNotEmpty()
  telefono: string;

  @IsOptional()
  materia_id?: number;
}
