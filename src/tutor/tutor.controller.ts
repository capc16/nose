@@ .. @@
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TutorService } from './tutor.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioActual } from '../auth/decorators/user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AsignarMateriaDto } from './dto/asignar-materia.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';



@Controller('tutores')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('coordinador')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateTutorDto) {
    return this.tutorService.create(dto);
  }

+  // Listar todos los tutores (público para que estudiantes puedan ver)
+  @Get()
+  async findAll() {
+    return this.tutorService.findAll();
+  }
+
+  // Obtener tutores por materia
+  @Get('por-materia/:materiaId')
+  async findByMateria(@Param('materiaId', ParseIntPipe) materiaId: number) {
+    return this.tutorService.findByMateria(materiaId);
+  }

  @Get('perfil')
  @UseGuards(AuthGuard('jwt'))
  async obtenerPerfil(@UsuarioActual() usuario: any) {
    return this.tutorService.obtenerPerfil(usuario.id);
  }

  @Patch('perfil')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async actualizarPerfil(
    @UsuarioActual() usuario: any,
    @Body() dto: UpdateTutorDto,
  ) {
    return this.tutorService.actualizarPerfil(usuario.id, dto);
  }

  @Patch(':id/asignar-materia')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('coordinador')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async asignarMateria(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AsignarMateriaDto,
  ) {
    return this.tutorService.asignarMateria(id, dto);
  }
}