import { BadRequestException, Injectable } from "@nestjs/common";
import { ProductRepository } from "src/module/product-server/infrastructure/repository/product.repository";

@Injectable()
export class GetProductListingService {
    constructor(
        private readonly productRepo: ProductRepository,
    ) { }

    async getProductListing(offset?: number, limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const { data, total } = await this.productRepo.getProductListing(curr_offset, curr_limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: total,
            message: "Product Listing Success"
        }
    }
}