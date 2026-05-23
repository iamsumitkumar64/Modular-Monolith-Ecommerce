import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ReturnOrderDto } from "./return-order.dto";
import { ReturnOrderService } from "./return-order.service";

@Controller()
export class ReturnOrderController {
    constructor(private readonly returnOrderService: ReturnOrderService) { }

    @Post('/return')
    async returnOrder(@Req() req: Request, @Body() body: ReturnOrderDto) {
        return this.returnOrderService.returnOrder(req.user, body);
    }
}