import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { OrderEntity } from "../order/order.entity";

@Entity('order_item')
export class OrderItemEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

    @Column({ type: "uuid", nullable: false })
    order_uuid: string;

    @Column({ type: "uuid", nullable: false })
    product_uuid: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    name: string;

    @Column({
        type: "text",
        nullable: true,
    })
    description: string;

    @Column({
        type: "varchar",
        nullable: true,
    })
    image_url: string;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: false,
        default: 0,
    })
    price: number;

    @Column({ type: "integer", nullable: false, default: 1, })
    quantity: number;

    @ManyToOne(() => OrderEntity, (user) => user.items)
    @JoinColumn({ name: "order_uuid" })
    order: OrderEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}