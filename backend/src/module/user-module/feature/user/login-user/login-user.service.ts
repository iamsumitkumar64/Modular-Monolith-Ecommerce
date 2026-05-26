import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginUserDto } from "./login-user.dto";
import type { Request } from "express";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { BcryptService } from "src/module/common/infrastruture/services/bcrypt.service";
import { JwtHelperService } from "src/module/user-module/infrastructure/services/jwt.service";

@Injectable()
export class LoginUserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
        private readonly jwtHelperService: JwtHelperService,
    ) { }

    async loginUser(req: Request, body: LoginUserDto) {
        //check if already exists using this email
        const isUserExists = await this.userRepository.findByEmail(body.email);
        if (!isUserExists.length) {
            throw new BadRequestException('User not Exists with this Email ');
        }

        const isValid = await this.bcryptService.verifyPassword(body.password, isUserExists[0].password);
        if (!isValid) {
            throw new BadRequestException('Password not matched');
        }

        const token = await this.jwtHelperService.generateJwtToken(isUserExists[0]);
        return {
            message: "Logged In User",
            access_token: token,
            user: {
                name: isUserExists[0].name,
                email: isUserExists[0].email,
                uuid: isUserExists[0].uuid,
            }
        }
    }
}