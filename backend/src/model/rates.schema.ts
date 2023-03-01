import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";
export type RatesDocument = Rates & Document;
@Schema()
export class Rates {
    @Prop({required:true})
    usd: Number;
    @Prop({required:true, unique:true, lowercase:true})
    euro: Number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    createdBy: User;
}
export const RatesSchema = SchemaFactory.createForClass(Rates)