import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CartItemEntity } from "../cart-item/cart-item.entity";

@Entity('cart')
export class CartEntity {
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

    @Column({
        type: "decimal",
        precision: 12,
        scale: 2,
        nullable: false,
        default: 0,
    })
    total_price: number;

    @Column({ type: "varchar", nullable: true })
    shipment_address: string;

    @Column({ type: "varchar", nullable: true })
    city: string;

    @Column({ type: "varchar", nullable: true })
    postal_code: string;

    @Column({ type: "varchar", nullable: true })
    country: string;

    @Column({ type: "varchar", nullable: true, default: "PENDING" })
    status: string;

    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItemEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
