import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PaymentHistoryEntity } from "../payment-history/payment-history.entity";

@Entity("payment_card")
export class PaymentCardEntity {
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

    @Column({ type: "varchar", length: 32, nullable: false })
    name_on_card: string;

    @Column({ type: "varchar", length: 24, nullable: false })
    card_number: string;

    @Column({ type: "varchar", length: 4, nullable: false })
    expiry_month: string;

    @Column({ type: "varchar", length: 4, nullable: false })
    expiry_year: string;

    @ManyToOne(() => UserEntity, (user) => user.payment_cards)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @OneToMany(() => PaymentHistoryEntity, (card) => card.card)
    payment_histories: PaymentHistoryEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
