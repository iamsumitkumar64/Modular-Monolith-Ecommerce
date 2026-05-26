import { BadRequestException, Injectable, } from "@nestjs/common";
import { OrderEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { ProductRepository } from "src/module/product-module/infrastructure/repository/product.repository";

@Injectable()
export class OrderReturnService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly socketService: SocketService,
    ) { }

    async orderReturn(order: OrderEventPayload) {
        // increase stock one by one
        const increase = order.items.map(async (item) => {
            try {
                await this.productRepository.increaseStock(item.product_uuid, item.quantity);
                console.log(`Increase ${item.quantity} quantity in ${item.name} (UUID: ${item.product_uuid})`);
            } catch (err: any) {
                console.error(`Failed to return Stock increase for ${item.name}: ${err.message}`);
            }
        });

        await Promise.all(increase);
        await this.socketService.emitToUser(order.user_uuid, SocketEventNameEnum.PRODUCT_STOCK_INCREASE, order.items);
        return;
    }
}
