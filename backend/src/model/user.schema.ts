import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Rates } from "./rates.schema";
export type UserDocument = User & Document;
@Schema()
export class User {
    @Prop({required:true})
    fullname: string;
    @Prop({required:true, unique:true, lowercase:true})
    email: string;
    @Prop({required:true})
    password: string;
    @Prop({default: Date.now() })
    createdDate: Date;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Rates" })
    rates: Rates;
}
export const UserSchema = SchemaFactory.createForClass(User)