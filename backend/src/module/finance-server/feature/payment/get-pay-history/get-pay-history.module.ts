import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { GetPayHistoryController } from "./get-pay-history.controller";
import { GetPayHistoryService } from "./get-pay-history.service";

@Module({
    imports: [],
    controllers: [GetPayHistoryController],
    providers: [GetPayHistoryService, FinanceRepository],
    exports: [],
})
export class GetPayHistoryModule { }
