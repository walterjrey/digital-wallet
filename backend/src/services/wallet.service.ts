import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Wallet, WalletDocument } from "../model/wallet.schema";
import { User, UserDocument } from "../model/user.schema";
import { Rates, RatesDocument } from "src/model/rates.schema";

@Injectable()
export class WalletService {
    constructor(@InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Rates.name)private ratesModel: Model<RatesDocument>,
    @InjectModel(User.name)private userModel: Model<UserDocument>,
    ) { }

    async readWallets(user: User, orderByFav: string): Promise<Wallet[]> {
        let load = this.walletModel.find({ createdBy: user });
        if(orderByFav === 'true') {
            load.sort({fav: 'desc'});
        } else {
            load.sort({createdAt: 'desc'});
        }
        return await load.exec();
    }

    async createWallet(wallet: Object): Promise<Wallet> {
        const newWallet = new this.walletModel(wallet);
        return newWallet.save();
    }

    async readWallet(id, user: User): Promise<any> {
        return this.walletModel.findOne({ _id: id, createdBy: user }).populate("createdBy").exec();
    }

    async updateWalletBalance(id, bal): Promise<any> {
        return this.walletModel.updateOne({_id: id}, {balance: bal});
    }

    async delete(id, user: User): Promise<any> {
        return await this.walletModel.deleteOne({_id: id, createdBy: user });
    }

    async favWallet(id, fav: Number, user: User): Promise<any> {
        return this.walletModel.updateOne({ _id: id, createdBy: user },  { fav: fav });
    }

    async updateRates(user: User, rates: Rates): Promise<any> {
        let currentRates = await this.ratesModel.findOne({ createdBy: user }).exec();
        if(!currentRates) {
            rates.createdBy = user;
            currentRates = new this.ratesModel(rates);
        } else {
            currentRates.usd = rates.usd;
            currentRates.euro = rates.euro;
        }
        await currentRates.save();
        return await this.userModel.updateOne({email: user.email}, {rates: currentRates});
    } 
}