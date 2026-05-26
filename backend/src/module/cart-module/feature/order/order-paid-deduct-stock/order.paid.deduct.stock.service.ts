import { BadRequestException, Injectable, } from "@nestjs/common";
import { OrderEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { ProductRepository } from "src/module/cart-module/infrastructure/repository/product.repository";

@Injectable()
export class OrderPaidDeductStockService {
    constructor(
        private readonly repository: ProductRepository,
    ) { }

    async orderPaidDeductStock(order: OrderEventPayload) {
        // Deduct stock one by one
        const deductions = order.items.map(async (item) => {
            try {
                await this.repository.deductStock(item.product_uuid, item.quantity);
                console.log(`Deducted ${item.quantity} quantity from ${item.name} (UUID: ${item.product_uuid})`);
            } catch (err: any) {
                console.error(`Failed to deduct stock for ${item.name}: ${err.message}`);
            }
        });
        await Promise.all(deductions);

        return;
    }
}
