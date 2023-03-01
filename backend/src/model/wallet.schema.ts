import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";
export type WalletDocument = Wallet & Document;
@Schema()
export class Wallet {
    @Prop({required:true})
    address: string;
    @Prop({required:true})
    title: string;
    @Prop({default: Date.now() })
    createdDate: Date;
    @Prop({default: 0 })
    fav: Number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    createdBy: User;
    @Prop({default: 0 })
    balance: number;
    @Prop({default: 0 })
    firstTransactionTs: Number;
}
export const WalletSchema = SchemaFactory.createForClass(Wallet)