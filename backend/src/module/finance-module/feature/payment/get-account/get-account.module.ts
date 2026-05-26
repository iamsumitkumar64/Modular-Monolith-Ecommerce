import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-module/infrastructure/repository/finance.repository";
import { GetAccountController } from "./get-account.controller";
import { GetAccountService } from "./get-account.service";

@Module({
    imports: [],
    controllers: [GetAccountController],
    providers: [GetAccountService, FinanceRepository],
    exports: [],
})
export class GetAccountModule { }
