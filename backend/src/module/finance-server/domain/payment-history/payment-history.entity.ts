import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("payment_history")
export class PaymentHistoryEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "uuid", nullable: false })
    user_uuid: string;

    @Column({ type: "float", nullable: false })
    amount: number;

    @Column({ type: "varchar", length: 32, default: 'payment' })
    type: string;

    @Column({ type: "uuid", nullable: true })
    card_uuid: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;
}
