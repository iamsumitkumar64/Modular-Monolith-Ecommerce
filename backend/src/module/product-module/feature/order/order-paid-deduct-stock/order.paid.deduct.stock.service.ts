import { BadRequestException, Injectable, } from "@nestjs/common";
import { OrderEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { ProductRepository } from "src/module/product-module/infrastructure/repository/product.repository";

@Injectable()
export class OrderPaidDeductStockService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly socketService: SocketService,
    ) { }

    async orderPaidDeductStock(order: OrderEventPayload) {
        // Deduct stock one by one
        const deductions = order.items.map(async (item) => {
            try {
                await this.productRepository.deductStock(item.product_uuid, item.quantity);
                console.log(`Deducted ${item.quantity} quantity from ${item.name} (UUID: ${item.product_uuid})`);
            } catch (err: any) {
                console.error(`Failed to deduct stock for ${item.name}: ${err.message}`);
            }
        });

        await Promise.all(deductions);
        await this.socketService.emitToUser(order.user_uuid, SocketEventNameEnum.PRODUCT_STOCK_DEDUCT, order.items);

        return;
    }
}
