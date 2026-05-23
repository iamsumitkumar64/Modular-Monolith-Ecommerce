import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "./order.enum";
import { OrderItemEntity } from "../order-item/order-item.entity";

@Entity('order')
export class OrderEntity {
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
    user_uuid: string;

    @Column({ type: "uuid", nullable: false })
    cart_uuid: string;

    @Column({ type: "decimal", precision: 12, scale: 2, nullable: false, default: 0, })
    total_price: number;

    @Column({ type: "enum", enum: OrderPaymentStatusEnum, default: OrderPaymentStatusEnum.PENDING, nullable: false })
    payment_status: OrderPaymentStatusEnum;

    @Column({ type: "enum", enum: OrderStatusEnum, default: OrderStatusEnum.PENDING, nullable: false })
    order_status: OrderStatusEnum;

    @Column({ type: "enum", enum: OrderStatusEnum, nullable: true })
    returned_from_status: OrderStatusEnum | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    order_address: string;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @OneToMany(() => OrderItemEntity, item => item.order)
    items: OrderItemEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
