import { BadRequestException, Injectable, } from "@nestjs/common";
import { UserEntity } from "src/module/cart-module/domain/user/user.entity";
import { CartRepository } from "src/module/cart-module/infrastructure/repository/cart.repository";

@Injectable()
export class GetCartService {
    constructor(
        private readonly repository: CartRepository,
    ) { }

    async getCart(user: UserEntity) {
        const cart = await this.repository.findByUserUuid(user.uuid);
        if (!cart) {
            const createdCart = await this.repository.createCart({ user_uuid: user.uuid, });
            return {
                data: createdCart,
                message: "Cart Fetched Success",
            };
        }

        return {
            data: cart,
            message: "Cart Fetched Success",
        };
    }
}