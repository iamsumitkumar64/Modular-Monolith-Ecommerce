import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { PayUsingCardController } from "./pay-using-card.controller";
import { PayUsingCardService } from "./pay-using-card.service";
import { OutboxRepository } from "src/module/finance-server/infrastructure/repository/outbox.repo";

@Module({
    imports: [],
    controllers: [PayUsingCardController],
    providers: [PayUsingCardService, FinanceRepository, OutboxRepository],
    exports: [],
})
export class PayUsingCardUsingCardModule { }
