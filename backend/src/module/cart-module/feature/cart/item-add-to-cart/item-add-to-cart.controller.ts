import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ItemAddToCartService } from "./item-add-to-cart.service";
import type { Request } from "express";
import { ItemAddToCartDto } from "./item-add-to-cart.dto";

@Controller()
export class ItemAddToCartController {
    constructor(private readonly itemAddToCartService: ItemAddToCartService) { }

    @Post()
    async itemAddToCart(@Req() req: Request, @Body() body: ItemAddToCartDto) {
        return this.itemAddToCartService.itemAddToCart(req.user,body);
    }
}