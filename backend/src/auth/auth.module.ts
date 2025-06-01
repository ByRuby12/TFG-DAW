import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [PassportModule, UsuariosModule],
  controllers: [AuthController],
  providers: [GoogleStrategy],
})
export class AuthModule { }