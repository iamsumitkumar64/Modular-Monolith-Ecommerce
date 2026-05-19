import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { CartEntity } from "../../domain/cart/cart.entity";

@Injectable()
export class CartRepository extends Repository<CartEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_CART_SCHEMA || 'cart_schema')
        private readonly dataSource: DataSource,
    ) {
        super(CartEntity, dataSource.createEntityManager());
    }

    async createCart(body: Partial<CartEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findByUserUuid(user_uuid: string) {
        const cart = await this.findOne({
            where: {
                user_uuid: user_uuid
            },
            relations: {
                items: {
                    product: true
                },
                user: true
            }
        });
        return cart;
    }

    async findByUuid(uuid: string) {
        const cart = await this.findOne({
            where: {
                uuid,
            },
            relations: {
                items: true,
            },
        });
        return cart;
    }

    async updateCartTotal(uuid: string, total_price: number,) {
        await this.update(uuid, {
            total_price,
        });

        return await this.findByUuid(uuid);
    }

    async deleteCart(uuid: string) {
        return await this.softDelete(uuid);
    }
}