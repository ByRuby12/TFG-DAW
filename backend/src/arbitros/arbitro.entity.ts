import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('arbitros')
export class Arbitro {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    nombre: string
}