import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { AddAmountController } from "./add-amount.controller";
import { AddAmountService } from "./add-amount.service";

@Module({
    imports: [],
    controllers: [AddAmountController],
    providers: [AddAmountService, FinanceRepository],
    exports: [],
})
export class AddAmountModule { }
