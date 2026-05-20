import { BadRequestException, Injectable } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-server/infrastructure/repository/finance.repo";
import { UserEntity } from "src/module/user-server/domain/user/user.entity";
import { AddCardDto } from "./add-card-dto";

@Injectable()
export class AddCardService {
    constructor(
        private readonly financeRepo: FinanceRepository,
    ) { }

    async addCard(user: UserEntity, body: AddCardDto) {
        const payload = {
            ...body,
            user_uuid: user.uuid,
        };

        const card = await this.financeRepo.createCard(payload);
        return {
            data: card,
            message: "Card added successfully"
        };
    }
}