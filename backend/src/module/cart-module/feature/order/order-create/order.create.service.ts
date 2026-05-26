import { BadRequestException, Injectable, } from "@nestjs/common";
import { OrderCreatedEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { CartRepository } from "src/module/cart-module/infrastructure/repository/cart.repository";

@Injectable()
export class OrderCreateService {
    constructor(
        private readonly repository: CartRepository,
    ) { }

    async orderCreate(payload: OrderCreatedEventPayload) {
        await this.repository.deleteCart(payload.cart_uuid);
        await this.repository.createCart({ user_uuid: payload.user_uuid });
        return;
    }
}