import { BadRequestException, Injectable, } from "@nestjs/common";
import { UserEntity } from "src/module/cart-server/domain/user/user.entity";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";
import { CartItemRepository } from "src/module/cart-server/infrastructure/repository/cart.item.repo";
import { ItemRemoveFromCartDto } from "./item-remove-from-cart.dto";

@Injectable()
export class ItemRemoveFromCartService {
    constructor(
        private readonly cartRepo: CartRepository,
        private readonly cartItemRepo: CartItemRepository,
    ) { }

    async itemRemoveFromCart(user: UserEntity, body: ItemRemoveFromCartDto) {
        // check cart exists
        const isCartExists = await this.cartRepo.findByUserUuid(user.uuid);
        if (!isCartExists) {
            throw new BadRequestException("Cart not found");
        }
        if (isCartExists.uuid !== body.cart_uuid) {
            throw new BadRequestException("Cart not exits with your account");
        }

        // check is this item exists in cart
        const isCartItemExists = await this.cartItemRepo.findByUuid(body.item_uuid);
        if (!isCartItemExists) {
            throw new BadRequestException("Cart Item not found");
        }

        // deduct price of removed item
        const curr_price = isCartExists.total_price - isCartItemExists.product.price * isCartItemExists.quantity;
        console.log(curr_price, isCartExists.total_price, isCartItemExists.product.price, isCartItemExists.quantity);
        await this.cartRepo.updateCartTotal(isCartExists.uuid, curr_price);

        // delete item entry
        await this.cartItemRepo.deleteCartItem(body.item_uuid);
        return {
            message: "Item Removed from Cart Success",
        }
    }
}