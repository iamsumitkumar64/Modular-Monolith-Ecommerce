import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetPayHistoryService } from "./get-pay-history.service";

@Controller()
export class GetPayHistoryController {
    constructor(private readonly getPayHistoryService: GetPayHistoryService) { }

    @Get("/histories")
    async getPayHistories(@Req() req: Request) {
        return this.getPayHistoryService.getPayHistories(req.user);
    }
}