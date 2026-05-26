import { Module } from "@nestjs/common";
import { ProductRepository } from "src/module/cart-module/infrastructure/repository/product.repository";
import { ItemAddToCartController } from "./item-add-to-cart.controller";
import { ItemAddToCartService } from "./item-add-to-cart.service";
import { CartRepository } from "src/module/cart-module/infrastructure/repository/cart.repository";
import { CartItemRepository } from "src/module/cart-module/infrastructure/repository/cart.item.repository";

@Module({
    imports: [],
    controllers: [ItemAddToCartController],
    providers: [ItemAddToCartService, CartRepository, ProductRepository, CartItemRepository],
    exports: [],
})

export class ItemAddToCartModule { }