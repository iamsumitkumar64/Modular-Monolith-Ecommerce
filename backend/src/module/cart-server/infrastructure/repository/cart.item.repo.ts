import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CartItemEntity } from "../../domain/cart-item/cart-item.entity";

@Injectable()
export class CartItemRepository extends Repository<CartItemEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_CART_SCHEMA || "cart_schema")
        private readonly dataSource: DataSource,
    ) {
        super(CartItemEntity, dataSource.createEntityManager());
    }

    async createCartItem(body: Partial<CartItemEntity>) {
        const cartItem = this.create(body);
        return await this.save(cartItem);
    }

    async findByCartAndProduct(cart_uuid: string, product_uuid: string,) {
        return await this.findOne({
            where: {
                cart_uuid,
                product_uuid,
            },
        });
    }

    async findByUuid(uuid: string) {
        const cart = await this.findOne({
            where: {
                uuid,
            },
            relations:{
                product:true
            }
        });
        return cart;
    }

    async updateQuantity(uuid: string, quantity: number,) {
        await this.update(uuid, { quantity });

        return await this.findOne({
            where: { uuid },
        });
    }

    async deleteCartItem(uuid: string) {
        return await this.softDelete(uuid);
    }

    async findAllCartItems(cart_uuid: string) {
        return await this.find({
            where: { cart_uuid },
            relations: {
                product: true,
            },
        });
    }
}