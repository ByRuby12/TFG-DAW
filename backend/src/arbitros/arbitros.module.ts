import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Arbitro } from "./arbitro.entity";
import { ArbitrosService } from "./arbitros.service";
import { ArbitrosController } from "./arbitros.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Arbitro])],
    providers: [ArbitrosService],
    controllers: [ArbitrosController],
    exports: [ArbitrosService]
})
export class ArbitrosModule { }