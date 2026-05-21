import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentHistoryTypeEnum } from "./payment.type.enum";
import { UserEntity } from "../user/user.entity";
import { PaymentCardEntity } from "../payment-card/payment-card.entity";

@Entity("payment_history")
export class PaymentHistoryEntity {
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
    card_uuid: string | null;

    @Column({ type: "float", nullable: false })
    amount: number;

    @Column({ type: "enum", enum: PaymentHistoryTypeEnum, default: PaymentHistoryTypeEnum.PAYMENT_USING_CARD })
    type: PaymentHistoryTypeEnum;

    @Column({ type: "varchar", length: 255, nullable: true })
    description: string;

    @ManyToOne(() => UserEntity, (user) => user.payment_histories)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @ManyToOne(() => PaymentCardEntity, (card) => card.payment_histories)
    @JoinColumn({ name: "card_uuid" })
    card: PaymentCardEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
