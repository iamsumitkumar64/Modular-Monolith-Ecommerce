import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { CartItemEntity } from "../cart-item/cart-item.entity";

@Entity("product")
export class ProductEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

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

    @Column({ type: "integer", nullable: false, default: 1, })
    stock: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: false,
        default: 0,
    })
    price: number;

    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
    cart_items: CartItemEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}   