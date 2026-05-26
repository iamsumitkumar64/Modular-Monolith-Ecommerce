import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-module/infrastructure/repository/finance.repository";
import { PayUsingCardController } from "./pay-using-card.controller";
import { PayUsingCardService } from "./pay-using-card.service";
import { OutboxRepository } from "src/module/finance-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [PayUsingCardController],
    providers: [PayUsingCardService, FinanceRepository, OutboxRepository],
    exports: [],
})
export class PayUsingCardUsingCardModule { }
