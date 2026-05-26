import { MigrationInterface, QueryRunner, Table, TableForeignKey, } from "typeorm";

export class CartMigration1778505600002 implements MigrationInterface {
    name = "CartMigration1778505600002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cart",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false, },
                    { name: "user_uuid", type: "uuid", isNullable: false, },
                    { name: "total_price", type: "decimal", precision: 12, scale: 2, default: 0, isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "cart",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                name: "FK_cart_user",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("cart", "FK_cart_user");
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cart_user_uuid`);
        await queryRunner.dropTable("cart", true);
    }
}