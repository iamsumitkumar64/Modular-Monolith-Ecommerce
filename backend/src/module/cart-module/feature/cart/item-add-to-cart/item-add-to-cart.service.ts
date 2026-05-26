import { BadRequestException, Injectable, } from "@nestjs/common";
import { UserEntity } from "src/module/cart-module/domain/user/user.entity";
import { ItemAddToCartDto } from "./item-add-to-cart.dto";
import { CartRepository } from "src/module/cart-module/infrastructure/repository/cart.repository";
import { CartItemRepository } from "src/module/cart-module/infrastructure/repository/cart.item.repository";
import { ProductRepository } from "src/module/cart-module/infrastructure/repository/product.repository";

@Injectable()
export class ItemAddToCartService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly cartRepository: CartRepository,
        private readonly cartItemRepository: CartItemRepository,
    ) { }

    async itemAddToCart(user: UserEntity, body: ItemAddToCartDto,) {
        const { product_uuid, quantity = 1 } = body;

        // check product exists
        const product = await this.productRepository.findByUuid(product_uuid);
        if (!product) {
            throw new BadRequestException("Product not found");
        }
        if (product.stock == 0) {
            throw new BadRequestException("Stock of product is exhausted");
        }
        if (quantity > product.stock) {
            throw new BadRequestException("Quantity is Greater than Stock of product");
        }

        // find/create cart
        let cart = await this.cartRepository.findByUserUuid(user.uuid);
        if (!cart) {
            cart = await this.cartRepository.createCart({ user_uuid: user.uuid, });
        }

        // check item already exists in cart
        const existingCartItem = await this.cartItemRepository.findByCartAndProduct(cart.uuid, product_uuid);
        let cartItem;

        if (existingCartItem) {
            // update only quantity if already exists
            const updatedQuantity = existingCartItem.quantity + quantity;
            if (updatedQuantity > product.stock) {
                throw new BadRequestException("Quantity is Greater than Stock of product");
            }
            cartItem = await this.cartItemRepository.updateQuantity(existingCartItem.uuid, updatedQuantity,);
        } else {
            // create new cart item
            cartItem = await this.cartItemRepository.createCartItem({ cart_uuid: cart.uuid, product_uuid, quantity, });
        }

        // update total cart price
        const cartItems = await this.cartItemRepository.findAllCartItems(cart.uuid,);
        let totalPrice = 0;

        for (const item of cartItems) {
            totalPrice += Number(item.product.price) * item.quantity;
        }

        const updatedCart = await this.cartRepository.updateCartTotal(cart.uuid, totalPrice,);
        return {
            data: updatedCart,
            message: "Item Added to Cart Success",
        };
    }
}