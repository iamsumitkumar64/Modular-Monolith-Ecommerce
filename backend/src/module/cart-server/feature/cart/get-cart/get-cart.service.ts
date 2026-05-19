import { BadRequestException, Injectable, } from "@nestjs/common";
import { UserEntity } from "src/module/cart-server/domain/user/user.entity";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";

@Injectable()
export class GetCartService {
    constructor(
        private readonly cartRepo: CartRepository,
    ) { }

    async getCart(user: UserEntity) {
        const cart = await this.cartRepo.findByUserUuid(user.uuid);
        if (!cart) {
            const createdCart = await this.cartRepo.createCart({ user_uuid: user.uuid, });
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