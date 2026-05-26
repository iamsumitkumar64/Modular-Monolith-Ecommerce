import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CartItemEntity } from "../cart-item/cart-item.entity";
import { UserEntity } from "../user/user.entity";

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

    @Column({ type: "decimal", precision: 12, scale: 2, nullable: false, default: 0, })
    total_price: number;

    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItemEntity[];

    @OneToOne(() => UserEntity, (user) => user.cart)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
