import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './users/usuario.module';
import { AuthModule } from './auth/auth.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { TutorModule } from './tutor/tutor.module';
import { CoordinadorModule } from './coordinador/coordinador.module';
import { MateriaModule } from './materia/materia.module';
import { LogModule } from './logging/log.module';
import { SesionTutoriaModule } from './sesion-tutoria/sesion-tutoria.module';
import { SolicitudTutoriaModule } from './solicitud-tutoria/solicitud-tutoria.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsuarioModule,
    AuthModule,
    EstudianteModule,
    TutorModule,
    CoordinadorModule,
    MateriaModule,
    LogModule, 
    SesionTutoriaModule,
    SolicitudTutoriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}