import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Usuario } from "src/usuarios/usuario.entity";

export type EstadoReporte = 'Pendiente' | 'Completado' | 'Rechazado'

@Entity()
export class Reporte {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    titulo: string

    @Column()
    tipo: string

    @Column()
    correo: string

    @Column('text')
    descripcion: string

    @Column({ type: 'enum', enum: ['Pendiente', 'Completado', 'Rechazado'], default: 'Pendiente' })
    estado: EstadoReporte

    @CreateDateColumn()
    fecha: Date

    @ManyToOne(() => Usuario, u => u.reportes, { onDelete: 'CASCADE' })
    usuario: Usuario
}