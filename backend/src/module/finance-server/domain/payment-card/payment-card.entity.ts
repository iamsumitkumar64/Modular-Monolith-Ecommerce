import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("payment_card")
export class PaymentCardEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

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

    @CreateDateColumn()
    created_at: Date;
}
