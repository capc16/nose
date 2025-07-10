import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMateriaDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  codigo: string;
}
