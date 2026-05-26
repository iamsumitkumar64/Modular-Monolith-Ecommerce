import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { ProductEntity } from "../../domain/product/product.entity";

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_CART_SCHEMA || 'cart_schema')
        private readonly dataSource: DataSource,
    ) {
        super(ProductEntity, dataSource.createEntityManager());
    }

    async createProduct(body: Partial<ProductEntity>) {
        const entry = this.create(body);
        return await this.save(entry);
    }

    async findByUuid(uuid: string) {
        const product = await this.findOne({
            where: {
                uuid: uuid
            }
        });
        return product;
    }

    async deductStock(productUuid: string, quantity: number): Promise<void> {
        const product = await this.findByUuid(productUuid);
        if (!product) {
            throw new Error(`Product not found: ${productUuid}`);
        }

        product.stock -= quantity;
        await this.save(product);
    }

    async increaseStock(productUuid: string, quantity: number): Promise<void> {
        const product = await this.findByUuid(productUuid);
        if (!product) {
            throw new Error(`Product not found: ${productUuid}`);
        }

        product.stock += quantity;
        await this.save(product);
    }
}