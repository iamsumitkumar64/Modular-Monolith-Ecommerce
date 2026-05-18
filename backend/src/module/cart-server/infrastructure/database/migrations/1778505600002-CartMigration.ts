import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

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
                    { name: "shipment_address", type: "varchar", isNullable: true, },
                    { name: "city", type: "varchar", isNullable: true, },
                    { name: "postal_code", type: "varchar", isNullable: true, },
                    { name: "country", type: "varchar", isNullable: true, },
                    { name: "status", type: "varchar", default: "'PENDING'", isNullable: true, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cart", true);
    }
}
