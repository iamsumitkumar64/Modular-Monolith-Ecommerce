import { Module } from "@nestjs/common";
import { RegisterUserController } from "./register-user.controller";
import { RegisterUserService } from "./register-user.service";
import { UserRepository } from "src/module/user-server/infrastructure/repository/user.repo";
import { JwtHelperService } from "src/module/user-server/infrastructure/services/jwt.service";
import { BcryptService } from "src/module/common/services/bcrypt.service";
import { OutboxRepository } from "src/module/user-server/infrastructure/repository/outbox.repo";

@Module({
    imports: [],
    controllers: [RegisterUserController],
    providers: [
        UserRepository,
        RegisterUserService,
        JwtHelperService,
        BcryptService,
        OutboxRepository
    ],
    exports: [],
})

export class RegisterUserModule { }