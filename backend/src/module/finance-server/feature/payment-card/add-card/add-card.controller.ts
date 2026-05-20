import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AddCardDto } from "./add-card-dto";
import { AddCardService } from "./add-card.service";

@Controller()
export class AddCardController {
    constructor(private readonly addCardService: AddCardService) { }

    @Post("/card")
    async addCard(@Req() req: Request, @Body() body: AddCardDto) {
        return this.addCardService.addCard(req.user, body);
    }
}