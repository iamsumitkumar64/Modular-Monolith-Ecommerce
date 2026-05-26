import { BadRequestException, Injectable } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-module/infrastructure/repository/finance.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { AddCardDto } from "./add-card-dto";

@Injectable()
export class AddCardService {
    constructor(
        private readonly repository: FinanceRepository,
    ) { }

    async addCard(user: UserEntity, body: AddCardDto) {
        const payload = {
            ...body,
            user_uuid: user.uuid,
        };

        const card = await this.repository.createCard(payload);
        return {
            data: card,
            message: "Card added successfully"
        };
    }
}