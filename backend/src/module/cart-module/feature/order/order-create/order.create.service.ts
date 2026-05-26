import { BadRequestException, Injectable, } from "@nestjs/common";
import { CartRepository } from "src/module/cart-module/infrastructure/repository/cart.repository";

@Injectable()
export class OrderCreateService {
    constructor(
        private readonly repository: CartRepository,
    ) { }

    async orderCreate(payload: any) {
        await this.repository.deleteCart(payload.cart_uuid);
        await this.repository.createCart({ user_uuid: payload.user_uuid });
        return;
    }
}