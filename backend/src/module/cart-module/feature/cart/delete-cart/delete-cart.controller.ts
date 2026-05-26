import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { DeleteCartService } from "./delete-cart.service";

@Controller()
export class DeleteCartController {
    constructor(private readonly deleteCartService: DeleteCartService) { }

    @Delete()
    async deleteCart(@Req() req: Request) {
        return this.deleteCartService.deleteCart(req.user);
    }
}