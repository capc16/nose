import { IsNotEmpty, IsInt } from 'class-validator';

export class AsignarMateriaDto {
  @IsNotEmpty()
  @IsInt()
  materia_id: number;
}
