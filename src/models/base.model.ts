import { Prop } from '@nestjs/mongoose';

export abstract class BaseModel {
    _id: string;

    @Prop({ type: 'boolean', default: true })
    isActive: boolean;
}
