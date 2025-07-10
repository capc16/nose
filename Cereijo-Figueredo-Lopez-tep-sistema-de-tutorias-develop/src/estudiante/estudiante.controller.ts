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
} from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Estudiante } from './entities/estudiante.entity';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioActual } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';



@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('coordinador')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateEstudianteDto): Promise<Estudiante> {
    return this.estudianteService.create(dto);
  }

  @Get('perfil')
  @UseGuards(AuthGuard('jwt'))
  async obtenerPerfil(@UsuarioActual() usuario: any) {
    return this.estudianteService.obtenerPerfil(usuario.id);
  }
  @Patch('perfil')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
    async actualizarPerfil(
  @UsuarioActual() usuario: any,
  @Body() dto: UpdateEstudianteDto,
    ) {
    return this.estudianteService.actualizarPerfil(usuario.id, dto);
    }  
}
