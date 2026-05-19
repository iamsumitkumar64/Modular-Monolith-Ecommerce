import { MigrationInterface, QueryRunner, Table, TableForeignKey, } from "typeorm";

export class CartItemMigration1778505600003 implements MigrationInterface {
    name = "CartItemMigration1778505600003";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cart_item",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false, },
                    { name: "cart_uuid", type: "uuid", isNullable: false, },
                    { name: "product_uuid", type: "uuid", isNullable: false, },
                    { name: "quantity", type: "integer", default: 1, isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "cart_item",
            new TableForeignKey({
                columnNames: ["cart_uuid"],
                referencedTableName: "cart",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
        await queryRunner.createForeignKey(
            "cart_item",
            new TableForeignKey({
                columnNames: ["product_uuid"],
                referencedTableName: "product",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cart_item", true);
    }
}