import { Module } from "@nestjs/common";
import { ProductRepository } from "src/module/cart-server/infrastructure/repository/product.repository";
import { ItemAddToCartController } from "./item-add-to-cart.controller";
import { ItemAddToCartService } from "./item-add-to-cart.service";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";
import { CartItemRepository } from "src/module/cart-server/infrastructure/repository/cart.item.repo";

@Module({
    imports: [],
    controllers: [ItemAddToCartController],
    providers: [ItemAddToCartService, CartRepository, ProductRepository, CartItemRepository],
    exports: [],
})

export class ItemAddToCartModule { }