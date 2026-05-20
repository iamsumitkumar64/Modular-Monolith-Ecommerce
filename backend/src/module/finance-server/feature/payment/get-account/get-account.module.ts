import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { GetAccountController } from "./get-account.controller";
import { GetAccountService } from "./get-account.service";

@Module({
    imports: [],
    controllers: [GetAccountController],
    providers: [GetAccountService, FinanceRepository],
    exports: [],
})
export class GetAccountModule { }
