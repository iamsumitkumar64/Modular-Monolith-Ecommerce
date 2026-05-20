import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetAccountService } from "./get-account.service";

@Controller()
export class GetAccountController {
    constructor(private readonly getAccountService: GetAccountService) { }

   @Get("/account")
    async getAccount(@Req() req: Request) {
        return this.getAccountService.getAccount(req.user);
    }
}