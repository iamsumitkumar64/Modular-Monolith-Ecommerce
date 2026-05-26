import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CartEntity } from "../cart/cart.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

    @Column({ type: "varchar", nullable: false, })
    name: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    email: string;

    @Column({ type: "varchar", nullable: false })
    password: string;

    @OneToOne(() => CartEntity, cart => cart.user)
    cart: CartEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}