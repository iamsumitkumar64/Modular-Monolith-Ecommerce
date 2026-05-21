import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { PayUsingCardService } from "./pay-using-card.service";
import { PayUsingCardDto } from "./pay-using-card-dto";

@Controller()
export class PayUsingCardController {
    constructor(private readonly payUsingCardService: PayUsingCardService) { }

    @Post("/pay")
    async payUsingCard(@Req() req: Request, @Body() body: PayUsingCardDto) {
        return this.payUsingCardService.payUsingCard(req.user, body);
    }
}