import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class PasswordResetToken {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    correo: string

    @Column()
    token: string

    @Column()
    creadoEn: Date
}

