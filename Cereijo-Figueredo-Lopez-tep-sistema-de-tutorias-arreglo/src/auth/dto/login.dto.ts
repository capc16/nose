import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: '(FORMATO INVALIDO) El correo debe contener @ y .com' })
  correo: string;

  @MinLength(8, { message: 'La contraseña debe tener MINIMO 8 caracteres' })
  @MaxLength(15, { message: 'La contraseña debe tener MAXIMO 15 caracteres' })
  contraseña: string;
}