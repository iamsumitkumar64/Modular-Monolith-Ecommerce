import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetCardsService } from "./get-cards.service";

@Controller()
export class GetCardsController {
    constructor(private readonly getCardsService: GetCardsService) { }

    @Get("/card")
    async getCards(@Req() req: Request) {
        return this.getCardsService.getCards(req.user);
    }
}