import { Module } from "@nestjs/common";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";
import { CartItemRepository } from "src/module/cart-server/infrastructure/repository/cart.item.repo";
import { ItemUpdateInCartController } from "./item-update-in-cart.controller";
import { ItemUpdateInCartService } from "./item-update-in-cart.service";

@Module({
    imports: [],
    controllers: [ItemUpdateInCartController],
    providers: [ItemUpdateInCartService, CartRepository, CartItemRepository],
    exports: [],
})

export class ItemUpdateInCartModule { }