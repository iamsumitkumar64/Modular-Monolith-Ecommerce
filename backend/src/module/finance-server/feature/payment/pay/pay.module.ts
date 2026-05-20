import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { PayController } from "./pay.controller";
import { PayService } from "./pay.service";

@Module({
    imports: [],
    controllers: [PayController],
    providers: [PayService, FinanceRepository],
    exports: [],
})
export class PayModule { }
