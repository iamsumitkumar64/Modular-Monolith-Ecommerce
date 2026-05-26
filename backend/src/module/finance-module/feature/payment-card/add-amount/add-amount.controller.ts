import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AddAmountService } from "./add-amount.service";
import { AddAmountDto } from "./add-amount-dto";

@Controller()
export class AddAmountController {
    constructor(private readonly addAmountService: AddAmountService) { }

    @Post("/account/add-amount")
    async addAmount(@Req() req: Request, @Body() body: AddAmountDto) {
        return this.addAmountService.addAmount(req.user, body.amount);
    }
}