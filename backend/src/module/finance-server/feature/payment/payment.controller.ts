import { Body, Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Controller("finance")
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get("/cards")
    async getCards(@Req() req: any) {
        return this.paymentService.getCards(req.user);
    }

    @Post("/cards")
    async addCard(@Req() req: any, @Body() body: any) {
        return this.paymentService.addCard(req.user, body);
    }

    @Delete("/cards/:uuid")
    async deleteCard(@Req() req: any, @Param("uuid") uuid: string) {
        return this.paymentService.deleteCard(req.user, uuid);
    }

    @Get("/account")
    async getAccount(@Req() req: any) {
        return this.paymentService.getAccount(req.user);
    }

    @Post("/account/add-amount")
    async addAmount(@Req() req: any, @Body() body: any) {
        return this.paymentService.addAmount(req.user, body.amount);
    }

    @Post("/pay")
    async pay(@Req() req: any, @Body() body: any) {
        return this.paymentService.pay(req.user, body);
    }

    @Get("/histories")
    async getHistories(@Req() req: any) {
        return this.paymentService.getHistories(req.user);
    }
}
