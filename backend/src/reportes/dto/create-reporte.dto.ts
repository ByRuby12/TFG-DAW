import { IsString, IsEmail } from "class-validator";

export class CreateReporteDto {
  @IsString() titulo: string;
  @IsString() tipo: string;
  @IsEmail() correo: string;
  @IsString() descripcion: string
}