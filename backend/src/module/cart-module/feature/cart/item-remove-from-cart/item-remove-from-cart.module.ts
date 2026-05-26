import { Module } from "@nestjs/common";
import { ItemRemoveFromCartController } from "./item-remove-from-cart.controller";
import { ItemRemoveFromCartService } from "./item-remove-from-cart.service";
import { CartRepository } from "src/module/cart-module/infrastructure/repository/cart.repository";
import { CartItemRepository } from "src/module/cart-module/infrastructure/repository/cart.item.repository";

@Module({
    imports: [],
    controllers: [ItemRemoveFromCartController],
    providers: [ItemRemoveFromCartService, CartRepository, CartItemRepository],
    exports: [],
})

export class ItemRemoveFromCartModule { }