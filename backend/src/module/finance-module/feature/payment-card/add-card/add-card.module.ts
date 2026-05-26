import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-module/infrastructure/repository/finance.repository";
import { AddCardController } from "./add-card.controller";
import { AddCardService } from "./add-card.service";

@Module({
    imports: [],
    controllers: [AddCardController],
    providers: [AddCardService, FinanceRepository],
    exports: [],
})
export class AddCardModule { }
