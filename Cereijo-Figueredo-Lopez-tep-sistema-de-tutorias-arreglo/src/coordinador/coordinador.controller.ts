import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CoordinadorService } from './coordinador.service';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioActual } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('coordinadores')
export class CoordinadorController {
  constructor(private readonly coordinadorService: CoordinadorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('coordinador')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateCoordinadorDto) {
    return this.coordinadorService.create(dto);
  }

  @Get('perfil')
  @UseGuards(AuthGuard('jwt'))
  async obtenerPerfil(@UsuarioActual() usuario: any) {
    return this.coordinadorService.obtenerPerfil(usuario.id);
  }

  @Patch('perfil')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async actualizarPerfil(
    @UsuarioActual() usuario: any,
    @Body() dto: UpdateCoordinadorDto,
  ) {
    return this.coordinadorService.actualizarPerfil(usuario.id, dto);
  }
}
