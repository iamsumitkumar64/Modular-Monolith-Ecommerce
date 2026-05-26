import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { DeleteCardService } from "./delete-card.service";

@Controller()
export class DeleteCardController {
    constructor(private readonly deleteCardService: DeleteCardService) { }

    @Delete("/card/:uuid")
    async deleteCard(@Req() req: Request, @Param("uuid") uuid: string) {
        return this.deleteCardService.deleteCard(req.user, uuid);
    }
}