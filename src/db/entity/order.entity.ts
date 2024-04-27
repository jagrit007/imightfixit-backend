import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export enum Status {
    Pending = 'pending',
    InProgress = 'in_progress',
    Completed = 'completed',
    Cancelled = 'cancelled',
}

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    service_id: number;

    @Column({ type: 'enum', enum: Status, default: Status.Pending })
    status: Status;

    @Column('decimal', {nullable: true})
    total_price: number | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}