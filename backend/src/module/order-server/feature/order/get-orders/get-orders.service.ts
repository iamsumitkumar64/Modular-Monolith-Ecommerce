import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/order-server/domain/user/user.entity";
import { OrderRepository } from "src/module/order-server/infrastructure/repository/order.repo";

@Injectable()
export class GetOrderListingService {
    constructor(
        private readonly orderRepo: OrderRepository,
    ) { }

    async getOrderListing(user: UserEntity, offset?: number, limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const { data, total } = await this.orderRepo.getOrderListing(user, curr_offset, curr_limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: total,
            message: "Product Listing Success"
        }
    }
}