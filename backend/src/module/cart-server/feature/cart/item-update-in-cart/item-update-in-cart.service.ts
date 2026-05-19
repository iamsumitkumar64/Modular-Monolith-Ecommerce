import { BadRequestException, Injectable, } from "@nestjs/common";
import { UserEntity } from "src/module/cart-server/domain/user/user.entity";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";
import { CartItemRepository } from "src/module/cart-server/infrastructure/repository/cart.item.repo";
import { ItemUpdateInCartDto } from "./item-update-in-cart.dto";

@Injectable()
export class ItemUpdateInCartService {
    constructor(
        private readonly cartRepo: CartRepository,
        private readonly cartItemRepo: CartItemRepository,
    ) { }

    async itemUpdateInCart(user: UserEntity, body: ItemUpdateInCartDto) {
        const { item_uuid, quantity = 1 } = body;
        // check is this item exists in cart
        const isCartItemExists = await this.cartItemRepo.findByUuid(item_uuid);
        if (!isCartItemExists) {
            throw new BadRequestException("Cart Item not found");
        }

        // check is cart exists
        let cart = await this.cartRepo.findByUserUuid(user.uuid);
        if (!cart) {
            cart = await this.cartRepo.createCart({ user_uuid: user.uuid, });
        }

        // update price and quantity acc to quantity
        const totalPrice = cart.total_price + isCartItemExists.product.price * quantity;
        await this.cartItemRepo.updateQuantity(item_uuid, quantity,);
        const updatedCart = await this.cartRepo.updateCartTotal(cart.uuid, totalPrice,);

        return {
            data: updatedCart,
            message: "Item updated in Cart Success",
        };
    }
}