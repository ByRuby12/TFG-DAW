import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { Usuario } from "src/usuarios/usuario.entity";

@Entity('personas')
export class Persona {
    @PrimaryGeneratedColumn({ name: 'id_persona' })
    id: number

    @Column({ type: 'varchar', length: 100 })
    nombre: string

    @Column({ type: 'varchar', length: 100, name: 'primer_apellido' })
    primer_apellido: string

    @Column({ type: 'varchar', length: 100, name: 'segundo_apellido', nullable: true })
    segundo_apellido: string

    @Column({ type: 'date', nullable: true })
    fechaNac: string | null

    @Column({ type: 'enum', enum: ['hombre', 'mujer'] })
    sexo: 'hombre' | 'mujer'

    @Column({ type: 'double', nullable: true })
    peso: number

    @Column({ type: 'double', nullable: true })
    altura: number

    @Column({ type: 'varchar', length: 100, nullable: true })
    municipio: string

    @Column({ type: 'varchar', length: 10, nullable: true, name: 'codigo_postal' })
    codigoPostal: string | null;

    @Column({ type: 'varchar', length: 200, nullable: true })
    direccion: string

    @Column({ type: 'text', nullable: true })
    biografia: string

    @OneToOne(() => Usuario, usuario => usuario.persona, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario
}