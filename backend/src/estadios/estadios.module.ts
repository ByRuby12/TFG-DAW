import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estadio } from './estadio.entity';
import { EstadiosService } from './estadios.service';
import { EstadiosController } from './estadios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Estadio])],
  providers: [EstadiosService],
  controllers: [EstadiosController],
  exports: [TypeOrmModule]
})
export class EstadioModule { }