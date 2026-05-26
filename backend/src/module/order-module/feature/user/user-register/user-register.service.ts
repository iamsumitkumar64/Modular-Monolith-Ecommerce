import { BadRequestException, Injectable, } from "@nestjs/common";
import { UserRepository } from "src/module/order-module/infrastructure/repository/user.repository";

@Injectable()
export class UserRegisterService {
    constructor(
        private readonly repository: UserRepository,
    ) { }

    async userRegister(payload: any) {
        const isUserExists = await this.repository.findByEmail(payload.email);
        if (isUserExists.length) {
            console.warn(`Duplicate skipped: ${isUserExists[0].email}`);
            return;
        }

        await this.repository.register(payload);
        return;
    }
}