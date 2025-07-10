import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { SesionTutoriaService } from './sesion-tutoria.service';
import { CreateSesionTutoriaDto } from './dto/create-sesion-tutoria.dto';
import { CompletarSesionDto } from './dto/completar-sesion.dto';
import { CalificarSesionDto } from './dto/calificar-sesion.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioActual } from '../auth/decorators/user.decorator';

@Controller('sesiones-tutoria')
@UseGuards(JwtAuthGuard)
export class SesionTutoriaController {
  constructor(private readonly sesionService: SesionTutoriaService) {}

  // Crear sesión directamente (tutor)
  @Post()
  @UseGuards(RolesGuard)
  @Roles('tutor')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @UsuarioActual() usuario: any,
    @Body() dto: CreateSesionTutoriaDto,
  ) {
    return this.sesionService.create(usuario.id, dto);
  }

  // Ver mis sesiones (estudiante)
  @Get('mis-sesiones')
  @UseGuards(RolesGuard)
  @Roles('estudiante')
  async misSesiones(@UsuarioActual() usuario: any) {
    return this.sesionService.findByEstudiante(usuario.id);
  }

  // Ver sesiones asignadas (tutor)
  @Get('asignadas')
  @UseGuards(RolesGuard)
  @Roles('tutor')
  async sesionesAsignadas(@UsuarioActual() usuario: any) {
    return this.sesionService.findByTutor(usuario.id);
  }

  // Completar sesión (tutor)
  @Patch(':id/completar')
  @UseGuards(RolesGuard)
  @Roles('tutor')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async completarSesion(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: any,
    @Body() dto: CompletarSesionDto,
  ) {
    return this.sesionService.completarSesion(id, usuario.id, dto);
  }

  // Calificar sesión (estudiante)
  @Patch(':id/calificar')
  @UseGuards(RolesGuard)
  @Roles('estudiante')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async calificarSesion(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: any,
    @Body() dto: CalificarSesionDto,
  ) {
    return this.sesionService.calificarSesion(id, usuario.id, dto);
  }

  // Ver detalle de sesión
  @Get(':id')
  async obtenerSesion(@Param('id', ParseIntPipe) id: number) {
    return this.sesionService.findById(id);
  }
}