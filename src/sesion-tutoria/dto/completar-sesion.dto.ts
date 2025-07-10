import { IsOptional, IsString } from 'class-validator';

export class CompletarSesionDto {
  @IsOptional()
  @IsString()
  notas_tutor?: string;
}