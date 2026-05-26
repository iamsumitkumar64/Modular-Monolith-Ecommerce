import { Module } from "@nestjs/common";
import { CartRepository } from "src/module/cart-module/infrastructure/repository/cart.repository";
import { GetCartController } from "./get-cart.controller";
import { GetCartService } from "./get-cart.service";

@Module({
    imports: [],
    controllers: [GetCartController],
    providers: [GetCartService, CartRepository],
    exports: [],
})

export class GetCartModule { }