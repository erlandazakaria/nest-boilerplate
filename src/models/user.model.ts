import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base.model';

export type UserDocument = User & Document;

@Schema()
export class User extends BaseModel {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true })
    name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
