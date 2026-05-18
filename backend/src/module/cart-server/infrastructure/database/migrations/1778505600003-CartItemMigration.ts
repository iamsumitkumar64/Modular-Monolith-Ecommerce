import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

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
                    { name: "product_name", type: "varchar", isNullable: false, },
                    { name: "product_price", type: "decimal", precision: 10, scale: 2, isNullable: false, },
                    { name: "quantity", type: "integer", default: 1, isNullable: false, },
                    { name: "subtotal", type: "decimal", precision: 12, scale: 2, isNullable: false, },
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

        await queryRunner.query(`CREATE INDEX idx_cart_item_cart_uuid ON cart_item(cart_uuid)`);
        await queryRunner.query(`CREATE INDEX idx_cart_item_product_uuid ON cart_item(product_uuid)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cart_item_product_uuid`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_cart_item_cart_uuid`);
        await queryRunner.dropTable("cart_item", true);
    }
}
