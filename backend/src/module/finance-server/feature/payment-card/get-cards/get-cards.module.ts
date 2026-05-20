import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { GetCardsController } from "./get-cards.controller";
import { GetCardsService } from "./get-cards.service";

@Module({
    imports: [],
    controllers: [GetCardsController],
    providers: [GetCardsService, FinanceRepository],
    exports: [],
})
export class GetCardsModule { }
