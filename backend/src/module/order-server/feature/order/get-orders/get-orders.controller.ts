import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetOrderListingService } from "./get-orders.service";
import type { Request } from "express";

@Controller()
export class GetOrderListingController {
    constructor(private readonly getOrderListingService: GetOrderListingService) { }

    @Get()
    async getOrderListing(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.getOrderListingService.getOrderListing(req.user,offset, limit);
    }
}