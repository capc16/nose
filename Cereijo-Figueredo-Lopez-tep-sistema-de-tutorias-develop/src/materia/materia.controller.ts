import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('materias')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  // 📚 Público: lista de materias
  @Get()
  getAll() {
    return this.materiaService.findAll();
  }

  // ✅ Solo coordinadores pueden crear
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('coordinador')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateMateriaDto) {
    return this.materiaService.create(dto);
  }

  // ✏️ Solo coordinadores pueden actualizar
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('coordinador')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMateriaDto,
  ) {
    return this.materiaService.update(id, dto);
  }
}
