import { IsNotEmpty, IsString } from "class-validator";

export class CreateEquipoDto {
  @IsString() @IsNotEmpty() nombre: string
  @IsString() @IsNotEmpty() siglas: string
  @IsString() @IsNotEmpty() lema: string
  @IsString() @IsNotEmpty() color: string
  @IsString() @IsNotEmpty() claveAcceso: string
  @IsString() @IsNotEmpty() estadio: string
}