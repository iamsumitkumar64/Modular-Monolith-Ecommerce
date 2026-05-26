import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class PaymentCardMigration1778505600002 implements MigrationInterface {
    name = "PaymentCardMigration1778505600002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "payment_card",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false, },
                    { name: "user_uuid", type: "uuid", isNullable: false, },
                    { name: "name_on_card", type: "varchar", length: "32", isNullable: false, },
                    { name: "card_number", type: "varchar", length: "24", isNullable: false, },
                    { name: "expiry_month", type: "varchar", length: "4", isNullable: false, },
                    { name: "expiry_year", type: "varchar", length: "4", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
        await queryRunner.createForeignKey(
            "payment_card",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                name: "FK_payment_card_user",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("payment_card", "FK_payment_card_user");
        await queryRunner.dropTable("payment_card", true);
    }
}