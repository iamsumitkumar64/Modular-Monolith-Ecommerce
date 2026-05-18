import { Body, Controller, Post, Req } from "@nestjs/common";
import { RegisterUserService } from "./register-user.service";
import { RegisterUserDto } from "./register-user.dto";
import type { Request } from "express";

@Controller('/register')
export class RegisterUserController {
    constructor(private readonly registerUserService: RegisterUserService) { }

    @Post()
    async registerUser(@Req() req: Request, @Body() body: RegisterUserDto) {
        return this.registerUserService.registerUser(req, body);
    }
}