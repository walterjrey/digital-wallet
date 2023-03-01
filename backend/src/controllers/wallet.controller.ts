import { Body, Controller, Delete, Get, HttpStatus, Param, Query, Post, Put, Req, Res } from "@nestjs/common";
import { Wallet } from "../model/wallet.schema"
import { WalletService } from "../services/wallet.service";
import { NetherscanService } from "../services/netherscan.service";
import { Rates } from "src/model/rates.schema";

@Controller('/api/v1/wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService, 
        private netherscanService: NetherscanService){}

    @Post()
    async createWallet(@Res() response, @Req() request, @Body() wallet: Wallet) {
        let ts =  await this.netherscanService.getFirstTransactionTs(wallet.address);
        let bal = await this.netherscanService.getBalanceFromAddress(wallet.address);
        const requestBody = { createdBy: request.user, address: wallet.address, title: wallet.title, firstTransactionTs: parseInt(ts) || 0, balance: bal }
        const newWallet = await this.walletService.createWallet(requestBody);
        return response.status(HttpStatus.CREATED).json({
            newWallet
        })
    }

    @Get()
    async readAll(@Req() request, @Query() query): Promise<Object> {
        const wallets = await this.walletService.readWallets(request.user, query.orderByFav);
        return wallets;
    }

    @Get('/:id')
    async read(@Param('id') id, @Req() request) {
        return this.walletService.readWallet(id, request.user);
    }

    @Delete('/:id')
    async delete(@Res() response, @Param('id') id, @Req() request) {
        await this.walletService.delete(id, request.user);
        return response.status(HttpStatus.OK).json({
            wallet: null
        })
    }

    @Put('/balance/:id')
    async update(@Res() response, @Param('id') id, @Req() request) {
        let wallet  = await this.walletService.readWallet(id, request.user);
        let bal = await this.netherscanService.getBalanceFromAddress(wallet.address);
        await this.walletService.updateWalletBalance(wallet._id, bal);
        return response.status(HttpStatus.ACCEPTED).json({
            balance: bal
        })
    }

    @Put('/fav/:id')
    async fav(@Param('id') id, @Req() request, @Body() body: Wallet) {
        return this.walletService.favWallet(id, body.fav, request.user);
    }
    
    @Post('/rates')
    async updateRates(@Res() response, @Req() request, @Body() body: Rates) {
        await this.walletService.updateRates(request.user, body);
        return response.status(HttpStatus.ACCEPTED).json({})
    }
}