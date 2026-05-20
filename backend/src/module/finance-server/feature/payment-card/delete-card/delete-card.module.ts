import { Module } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { DeleteCardController } from "./delete-card.controller";
import { DeleteCardService } from "./delete-card.service";

@Module({
    imports: [],
    controllers: [DeleteCardController],
    providers: [DeleteCardService, FinanceRepository],
    exports: [],
})
export class DeleteCardModule { }
