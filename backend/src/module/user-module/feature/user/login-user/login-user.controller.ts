import { Body, Controller, Post, Req } from "@nestjs/common";
import { LoginUserService } from "./login-user.service";
import { LoginUserDto } from "./login-user.dto";
import type { Request } from "express";

@Controller('/login')
export class LoginUserController {
    constructor(private readonly loginUserService: LoginUserService) { }

    @Post()
    async loginUser(@Req() req: Request, @Body() body: LoginUserDto) {
        return this.loginUserService.loginUser(req, body);
    }
}