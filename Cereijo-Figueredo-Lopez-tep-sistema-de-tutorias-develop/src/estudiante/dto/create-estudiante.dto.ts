import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  contraseña: string;

  @IsString()
  @MaxLength(20)
  cedula: string;

  @IsString()
  @MaxLength(100)
  carrera: string;

  @IsInt()
  @Min(1)
  semestre: number;

  @IsString()
  @MaxLength(20)
  telefono: string;
}
