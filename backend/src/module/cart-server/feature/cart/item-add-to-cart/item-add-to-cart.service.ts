import { BadRequestException, Injectable, } from "@nestjs/common";
import { UserEntity } from "src/module/cart-server/domain/user/user.entity";
import { ItemAddToCartDto } from "./item-add-to-cart.dto";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";
import { CartItemRepository } from "src/module/cart-server/infrastructure/repository/cart.item.repo";
import { ProductRepository } from "src/module/cart-server/infrastructure/repository/product.repo";

@Injectable()
export class ItemAddToCartService {
    constructor(
        private readonly productRepo: ProductRepository,
        private readonly cartRepo: CartRepository,
        private readonly cartItemRepo: CartItemRepository,
    ) { }

    async itemAddToCart(user: UserEntity, body: ItemAddToCartDto,) {
        const { product_uuid, quantity = 1 } = body;

        // check product exists
        const product = await this.productRepo.findByUuid(product_uuid);
        if (!product) {
            throw new BadRequestException("Product not found");
        }
        if (quantity > product.stock) {
            throw new BadRequestException("Quantity is Greater than Stock of product");
        }

        // find/create cart
        let cart = await this.cartRepo.findByUserUuid(user.uuid);
        if (!cart) {
            cart = await this.cartRepo.createCart({ user_uuid: user.uuid, });
        }

        // check item already exists in cart
        const existingCartItem = await this.cartItemRepo.findByCartAndProduct(cart.uuid, product_uuid);
        let cartItem;

        if (existingCartItem) {
            // update only quantity if already exists
            const updatedQuantity = existingCartItem.quantity + quantity;
            if (updatedQuantity > product.stock) {
                throw new BadRequestException("Quantity is Greater than Stock of product");
            }
            cartItem = await this.cartItemRepo.updateQuantity(existingCartItem.uuid, updatedQuantity,);
        } else {
            // create new cart item
            cartItem = await this.cartItemRepo.createCartItem({ cart_uuid: cart.uuid, product_uuid, quantity, });
        }

        // update total cart price
        const cartItems = await this.cartItemRepo.findAllCartItems(cart.uuid,);
        let totalPrice = 0;

        for (const item of cartItems) {
            totalPrice += Number(item.product.price) * item.quantity;
        }

        const updatedCart = await this.cartRepo.updateCartTotal(cart.uuid, totalPrice,);
        return {
            data: updatedCart,
            message: "Item Added to Cart Success",
        };
    }
}