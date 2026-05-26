import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ItemRemoveFromCartService } from "./item-remove-from-cart.service";
import type { Request } from "express";
import { ItemRemoveFromCartDto } from "./item-remove-from-cart.dto";

@Controller()
export class ItemRemoveFromCartController {
    constructor(private readonly itemRemoveFromCartService: ItemRemoveFromCartService) { }

    @Delete()
    async itemRemoveFromCart(@Req() req: Request, @Body() body: ItemRemoveFromCartDto) {
        return this.itemRemoveFromCartService.itemRemoveFromCart(req.user, body);
    }
}