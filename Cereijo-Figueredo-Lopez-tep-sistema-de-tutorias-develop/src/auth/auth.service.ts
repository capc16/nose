import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../users/usuario.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(correo: string, contraseña: string) {
    const usuario = await this.usuarioService.findByCorreo(correo);
    if (!usuario) {
      throw new UnauthorizedException('Correo no registrado');
    }

    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordValida) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: await this.usuarioService.obtenerRol(usuario.id),
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token
    };
  }
}
