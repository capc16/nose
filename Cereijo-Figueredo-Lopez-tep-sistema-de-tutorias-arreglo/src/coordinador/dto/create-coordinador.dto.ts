import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCoordinadorDto {
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  correo: string;

  @MinLength(6)
  contraseña: string;

  @IsNotEmpty()
  cedula: string;

  @IsNotEmpty()
  departamento: string;

  @IsNotEmpty()
  extension_interna: string;
}
