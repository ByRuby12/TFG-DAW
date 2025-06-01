import { IsOptional, IsEnum, IsString, IsDateString, IsArray, ValidateNested } from "class-validator";
import { EstadoPartido } from "../partido.entity";
import { Type } from "class-transformer";
import { Gol } from "../gol.entity";
import { Tarjeta } from "../tarjeta.entity";

export class UpdatePartidoDto {
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsDateString() fechaInicio?: Date;
  @IsOptional() @IsEnum(EstadoPartido) estado?: EstadoPartido;
  @IsOptional() @IsString() codigoPostal?: string
  @IsOptional() @IsString() estadio?: string
  @IsOptional() @IsArray() @ValidateNested({ each: true })
  @Type(() => Gol)
  goles?: Gol[]

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => Tarjeta)
  tarjetas?: Tarjeta[]
}