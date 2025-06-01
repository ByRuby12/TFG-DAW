import { Entity, Column, PrimaryGeneratedColumn, Double, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Jugador } from "src/jugadores/jugador.entity";
import { Persona } from "src/personas/persona.entity";
import { Reporte } from "src/reportes/reporte.entity";

export enum RolUsuario {
    JUGADOR = "jugador",
    ARBITRO = "arbitro",
    ADMIN = "administrador"
}

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'Nombre_usu' })
    Nombreusu: string

    @Column({ name: 'Contrasena' })
    contrasena: string

    @Column({ name: 'Correo' })
    correo: string

    @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.JUGADOR })
    rol: RolUsuario

    @Column({ default: false })
    confirmado: boolean

    @Column({ type: 'varchar', nullable: true })
    codigoRecuperacion: string | null

    @Column({ type: 'bigint', nullable: true })
    codigoExpiracion: number | null

    @Column({ nullable: true, default: "../src/assets/logo/logo.png" })
    foto: string

    @OneToOne(() => Persona, persona => persona.usuario, { cascade: true })
    persona: Persona

    @OneToOne(() => Jugador, jugador => jugador.usuario, { cascade: true })
    jugador: Jugador

    @OneToMany(() => Reporte, r => r.usuario)
    reportes: Reporte[]
}