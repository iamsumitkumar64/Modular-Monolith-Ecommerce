import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterUserDto } from "./register-user.dto";
import type { Request } from "express";
import { RabbitMQService } from "src/module/common/infrastruture/rabbit-mq/rabbit-mq.service";
import { UserRepository } from "src/module/user-server/infrastructure/repository/user.repo";
import { BcryptService } from "src/module/common/services/bcrypt.service";
import { JwtHelperService } from "src/module/user-server/infrastructure/services/jwt.service";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OutboxRepository } from "src/module/user-server/infrastructure/repository/outbox.repo";

@Injectable()
export class RegisterUserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly bcryptService: BcryptService,
        private readonly jwtHelperService: JwtHelperService,
        private readonly rabbitMQService: RabbitMQService,
        private readonly outboxRepo: OutboxRepository,
    ) { }

    async registerUser(req: Request, body: RegisterUserDto) {
        //check if already exists using this email
        const isUserExists = await this.userRepo.findByEmail(body.email);
        if (isUserExists.length) {
            throw new BadRequestException('User Already Exists with this Email');
        }

        //hashed password using bcrypt
        body.password = await this.bcryptService.hashPassword(body.password);

        //register user in DB
        const RegisteredUser = await this.userRepo.register(body);

        // generate token for accessing resources
        const token = await this.jwtHelperService.generateJwtToken(RegisteredUser);

        // not publish direct to mq-queue
        // await this.rabbitMQService.publishToExchange(
        //     ExchangeNameEnum.USER_EXCHANGE,
        //     RoutingKeyEnum.USER_REGISTERED,
        //     RegisteredUser,
        // );

        // make entry of publish exchange
        await this.outboxRepo.createOutboxntry({
            exchange_name: ExchangeNameEnum.USER_EXCHANGE,
            routing_key: RoutingKeyEnum.USER_REGISTERED,
            message_payload: RegisteredUser,
        });

        return {
            message: "Registered User",
            access_token: token,
            user: {
                name: RegisteredUser.name,
                email: RegisteredUser.email,
                uuid: RegisteredUser.uuid,
            }
        }
    }
}