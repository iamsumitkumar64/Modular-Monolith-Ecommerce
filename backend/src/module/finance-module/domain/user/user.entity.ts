import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentAccountEntity } from "../payment-account/payment-account.entity";
import { PaymentCardEntity } from "../payment-card/payment-card.entity";
import { PaymentHistoryEntity } from "../payment-history/payment-history.entity";

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

    @OneToOne(() => PaymentAccountEntity, payment_acc => payment_acc.user)
    payment_account: PaymentAccountEntity;

    @OneToMany(() => PaymentCardEntity, payment_card => payment_card.user)
    payment_cards: PaymentCardEntity[];

    @OneToMany(() => PaymentHistoryEntity, payment_his => payment_his.user)
    payment_histories: PaymentHistoryEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}