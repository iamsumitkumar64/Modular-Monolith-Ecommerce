import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity("payment_account")
export class PaymentAccountEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

    @Column({ type: "uuid", nullable: false, unique: true })
    user_uuid: string;

    @Column({ type: "float", default: 0 })
    balance: number;

    @OneToOne(() => UserEntity, (user) => user.payment_account)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
