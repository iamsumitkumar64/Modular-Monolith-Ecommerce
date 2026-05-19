import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetCartService } from "./get-cart.service";

@Controller()
export class GetCartController {
    constructor(private readonly getCartService: GetCartService) { }

    @Get()
    async getCart(@Req() req: Request) {
        return this.getCartService.getCart(req.user);
    }
}