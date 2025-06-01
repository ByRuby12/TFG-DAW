import { IsString, IsOptional, IsEnum, IsEmail } from "class-validator";
import { RolUsuario } from "../usuario.entity";

export class UpdateUsuarioDto {
  @IsOptional() @IsString() Nombreusu?: string;
  @IsOptional() @IsEmail() correo?: string;
  @IsOptional() @IsEnum(RolUsuario) rol?: RolUsuario;
  @IsOptional() @IsString() foto?: string
}