import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, ForeignKey, JoinColumn } from "typeorm";
import { CartEntity } from "../cart/cart.entity";

@Entity('cart_item')
export class CartItemEntity {
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
    cart_uuid: string;

    @Column({ type: "uuid", nullable: false })
    product_uuid: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    product_name: string;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: false,
    })
    product_price: number;

    @Column({
        type: "integer",
        nullable: false,
        default: 1,
    })
    quantity: number;

    @Column({
        type: "decimal",
        precision: 12,
        scale: 2,
        nullable: false,
    })
    subtotal: number;

    @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: "CASCADE" })
    @JoinColumn({ name: "cart_uuid", referencedColumnName: "uuid" })
    cart: CartEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
