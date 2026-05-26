import { Body, Controller, Get, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ItemUpdateInCartService } from "./item-update-in-cart.service";
import { ItemUpdateInCartDto } from "./item-update-in-cart.dto";

@Controller()
export class ItemUpdateInCartController {
    constructor(private readonly itemUpdateInCartService: ItemUpdateInCartService) { }

    @Patch()
    async itemUpdateInCart(@Req() req: Request, @Body() body: ItemUpdateInCartDto) {
        return this.itemUpdateInCartService.itemUpdateInCart(req.user, body);
    }
}