import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class PaymentAccountMigration1778505600001 implements MigrationInterface {
    name = "PaymentAccountMigration1778505600001";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "payment_account",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false, },
                    { name: "user_uuid", type: "uuid", isUnique: true, isNullable: false, },
                    { name: "balance", type: "float", default: 0, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
        await queryRunner.createForeignKey(
            "payment_account",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                name: "FK_payment_account_user",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("payment_account", "FK_payment_account_user");
        await queryRunner.dropTable("payment_account", true);
    }
}