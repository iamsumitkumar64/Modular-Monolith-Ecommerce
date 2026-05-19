import { BadRequestException, Injectable, } from "@nestjs/common";
import { UserEntity } from "src/module/cart-server/domain/user/user.entity";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";

@Injectable()
export class DeleteCartService {
    constructor(
        private readonly cartRepo: CartRepository,
    ) { }

    async deleteCart(user: UserEntity) {
        const isCartExists = await this.cartRepo.findByUserUuid(user.uuid);
        if (!isCartExists) {
            throw new BadRequestException("Cart not found");
        }

        await this.cartRepo.deleteCart(isCartExists.uuid);

        return {
            message: "Cart Deleted Success",
        };
    }
}