import { BadRequestException, Injectable } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-module/infrastructure/repository/finance.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";

@Injectable()
export class GetCardsService {
    constructor(
        private readonly repository: FinanceRepository,
    ) { }

    async getCards(user: UserEntity) {
        const cards = await this.repository.findUserCards(user.uuid);

        return {
            data: cards,
            message: "Cards fetched successfully"
        }
    }
}