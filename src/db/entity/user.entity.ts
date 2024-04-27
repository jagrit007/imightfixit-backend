import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToMany} from 'typeorm';
import {Service} from "./service.entity";

export enum Role {
    User = 'user',
    Provider = 'provider',
}

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => Service, (service) => service.user)
    services: Service[];

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}