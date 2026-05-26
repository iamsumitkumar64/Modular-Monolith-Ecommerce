import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-module/infrastructure/repository/finance.repository";
import { GetCardsController } from "./get-cards.controller";
import { GetCardsService } from "./get-cards.service";

@Module({
    imports: [],
    controllers: [GetCardsController],
    providers: [GetCardsService, FinanceRepository],
    exports: [],
})
export class GetCardsModule { }
