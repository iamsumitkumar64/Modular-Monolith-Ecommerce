import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { FinanceRepository } from "../../infrastructure/repository/finance.repo";

@Module({
    imports: [],
    controllers: [PaymentController],
    providers: [PaymentService, FinanceRepository],
    exports: [],
})
export class PaymentModule { }
