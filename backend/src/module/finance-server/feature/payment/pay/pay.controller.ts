import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { PayService } from "./pay.service";
import { PayDto } from "./pay-dto";

@Controller()
export class PayController {
    constructor(private readonly payService: PayService) { }

    @Post("/pay")
    async Pay(@Req() req: Request, @Body() body: PayDto) {
        return this.payService.pay(req.user, body);
    }
}