import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { User } from "../model/user.schema";
import { UserService } from "../services/user.service";
import { NetherscanService } from "src/services/netherscan.service";
import { JwtService } from '@nestjs/jwt'

@Controller('/api/v1/user')
export class UserController {
    constructor(private readonly userService: UserService,
        private jwtService: JwtService, 
        private netherscanService: NetherscanService
    ) { }

    @Post('/signup')
    async Signup(@Res() response, @Body() user: User) {
        const newUSer = await this.userService.signup(user);
        return response.status(HttpStatus.CREATED).json({
            newUSer
        })
    }

    @Post('/signin')
    async SignIn(@Res() response, @Body() user: User) {
        const result = await this.userService.signin(user, this.jwtService);
        let token = result.token;
        let rates = result.rates;
        if(!result.rates) {
            rates = await this.netherscanService.getEthPrice();
        }
        return response.status(HttpStatus.OK).json({ token, rates })
    }
}