import { Module } from "@nestjs/common";
import { ItemRemoveFromCartController } from "./item-remove-from-cart.controller";
import { ItemRemoveFromCartService } from "./item-remove-from-cart.service";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";
import { CartItemRepository } from "src/module/cart-server/infrastructure/repository/cart.item.repo";

@Module({
    imports: [],
    controllers: [ItemRemoveFromCartController],
    providers: [ItemRemoveFromCartService, CartRepository, CartItemRepository],
    exports: [],
})

export class ItemRemoveFromCartModule { }