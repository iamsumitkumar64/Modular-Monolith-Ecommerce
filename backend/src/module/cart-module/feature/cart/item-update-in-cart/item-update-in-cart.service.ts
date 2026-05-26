import { BadRequestException, Injectable, } from "@nestjs/common";
import { UserEntity } from "src/module/cart-module/domain/user/user.entity";
import { CartRepository } from "src/module/cart-module/infrastructure/repository/cart.repository";
import { CartItemRepository } from "src/module/cart-module/infrastructure/repository/cart.item.repository";
import { ItemUpdateInCartDto } from "./item-update-in-cart.dto";

@Injectable()
export class ItemUpdateInCartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly cartItemRepository: CartItemRepository,
    ) { }

    async itemUpdateInCart(user: UserEntity, body: ItemUpdateInCartDto) {
        const { item_uuid, quantity = 1 } = body;
        // check is this item exists in cart
        const isCartItemExists = await this.cartItemRepository.findByUuid(item_uuid);
        if (!isCartItemExists) {
            throw new BadRequestException("Cart Item not found");
        }

        // check is cart exists
        let cart = await this.cartRepository.findByUserUuid(user.uuid);
        if (!cart) {
            cart = await this.cartRepository.createCart({ user_uuid: user.uuid, });
        }

        // update price and quantity acc to quantity
        const totalPrice = cart.total_price + isCartItemExists.product.price * quantity;
        await this.cartItemRepository.updateQuantity(item_uuid, quantity,);
        const updatedCart = await this.cartRepository.updateCartTotal(cart.uuid, totalPrice,);

        return {
            data: updatedCart,
            message: "Item updated in Cart Success",
        };
    }
}