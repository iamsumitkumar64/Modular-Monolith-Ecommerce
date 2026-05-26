import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetProductListingService } from "./get-product-listing.service";

@Controller()
export class GetProductListingController {
    constructor(private readonly getProductListingService: GetProductListingService) { }

    @Get()
    async getProductListing(@Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.getProductListingService.getProductListing(offset, limit);
    }
}