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
import { SolicitudTutoriaService } from './solicitud-tutoria.service';
import { CreateSolicitudTutoriaDto } from './dto/create-solicitud-tutoria.dto';
import { ResponderSolicitudDto } from './dto/responder-solicitud.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioActual } from '../auth/decorators/user.decorator';

@Controller('solicitudes-tutoria')
@UseGuards(JwtAuthGuard)
export class SolicitudTutoriaController {
  constructor(private readonly solicitudService: SolicitudTutoriaService) {}

  // Crear solicitud (solo estudiantes)
  @Post()
  @UseGuards(RolesGuard)
  @Roles('estudiante')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @UsuarioActual() usuario: any,
    @Body() dto: CreateSolicitudTutoriaDto,
  ) {
    return this.solicitudService.create(usuario.id, dto);
  }

  // Ver mis solicitudes (estudiante)
  @Get('mis-solicitudes')
  @UseGuards(RolesGuard)
  @Roles('estudiante')
  async misSolicitudes(@UsuarioActual() usuario: any) {
    return this.solicitudService.findByEstudiante(usuario.id);
  }

  // Ver solicitudes asignadas (tutor)
  @Get('asignadas')
  @UseGuards(RolesGuard)
  @Roles('tutor')
  async solicitudesAsignadas(@UsuarioActual() usuario: any) {
    return this.solicitudService.findByTutor(usuario.id);
  }

  // Responder solicitud (tutor)
  @Patch(':id/responder')
  @UseGuards(RolesGuard)
  @Roles('tutor')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async responderSolicitud(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: any,
    @Body() dto: ResponderSolicitudDto,
  ) {
    return this.solicitudService.responderSolicitud(id, usuario.id, dto);
  }

  // Ver detalle de solicitud
  @Get(':id')
  async obtenerSolicitud(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudService.findById(id);
  }
}