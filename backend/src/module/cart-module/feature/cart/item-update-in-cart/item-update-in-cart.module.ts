import { Module } from "@nestjs/common";
import { CartRepository } from "src/module/cart-module/infrastructure/repository/cart.repository";
import { CartItemRepository } from "src/module/cart-module/infrastructure/repository/cart.item.repository";
import { ItemUpdateInCartController } from "./item-update-in-cart.controller";
import { ItemUpdateInCartService } from "./item-update-in-cart.service";

@Module({
    imports: [],
    controllers: [ItemUpdateInCartController],
    providers: [ItemUpdateInCartService, CartRepository, CartItemRepository],
    exports: [],
})

export class ItemUpdateInCartModule { }