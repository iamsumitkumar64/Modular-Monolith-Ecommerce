import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class PaymentHistoryMigration1778505600003 implements MigrationInterface {
    name = "PaymentHistoryMigration1778505600003";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "finance_schema"."payment_history_type_enum" AS ENUM('payment_using_card', 'topup', 'refund');`);

        await queryRunner.createTable(
            new Table({
                name: "payment_history",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false, },
                    { name: "user_uuid", type: "uuid", isNullable: false, },
                    { name: "order_uuid", type: "uuid", isNullable: true, },
                    { name: "amount", type: "float", isNullable: false, },
                    { name: "type", type: `"finance_schema"."payment_history_type_enum"`, default: `'payment_using_card'` },
                    { name: "card_uuid", type: "uuid", isNullable: true, },
                    { name: "description", type: "varchar", length: "255", isNullable: true, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
        await queryRunner.createForeignKey(
            "payment_history",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                name: "FK_payment_history_user",
                onDelete: "CASCADE",
            })
        );
        await queryRunner.createForeignKey(
            "payment_history",
            new TableForeignKey({
                columnNames: ["card_uuid"],
                referencedTableName: "payment_card",
                referencedColumnNames: ["uuid"],
                name: "FK_payment_history_card",
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("payment_history", "FK_payment_history_user");
        await queryRunner.dropForeignKey("payment_history", "FK_payment_history_card");
        await queryRunner.dropTable("payment_history", true);
        await queryRunner.query(`DROP TYPE "finance_schema"."payment_history_type_enum"`);
    }
}