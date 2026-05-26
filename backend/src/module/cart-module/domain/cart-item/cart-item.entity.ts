import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, ForeignKey, JoinColumn } from "typeorm";
import { CartEntity } from "../cart/cart.entity";
import { ProductEntity } from "../product/product.entity";

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

    @Column({ type: "integer", nullable: false, default: 1, })
    quantity: number;

    @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: "CASCADE" })
    @JoinColumn({ name: "cart_uuid" })
    cart: CartEntity;

    @ManyToOne(() => ProductEntity, (product) => product.cart_items)
    @JoinColumn({ name: "product_uuid" })
    product: ProductEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
