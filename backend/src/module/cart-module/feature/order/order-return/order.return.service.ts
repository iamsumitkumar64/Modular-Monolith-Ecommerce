import { BadRequestException, Injectable, } from "@nestjs/common";
import { ProductRepository } from "src/module/cart-module/infrastructure/repository/product.repository";

@Injectable()
export class OrderReturnService {
    constructor(
        private readonly repository: ProductRepository,
    ) { }

    async orderReturn(order: any) {
        // increase stock one by one
        const increase = order.items.map(async (item) => {
            try {
                await this.repository.increaseStock(item.product_uuid, item.quantity);
                console.log(`Increase ${item.quantity} quantity in ${item.name} (UUID: ${item.product_uuid})`);
            } catch (err: any) {
                console.error(`Failed to return Stock increase for ${item.name}: ${err.message}`);
            }
        });

        await Promise.all(increase);
        return;
    }
}