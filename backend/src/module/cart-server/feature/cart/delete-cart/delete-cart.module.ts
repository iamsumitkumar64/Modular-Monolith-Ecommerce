import { Module } from "@nestjs/common";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";
import { DeleteCartController } from "./delete-cart.controller";
import { DeleteCartService } from "./delete-cart.service";

@Module({
    imports: [],
    controllers: [DeleteCartController],
    providers: [DeleteCartService, CartRepository],
    exports: [],
})

export class DeleteCartModule { }