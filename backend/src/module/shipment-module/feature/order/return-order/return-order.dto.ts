import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReturnOrderDto {
    @IsUUID()
    @IsNotEmpty()
    order_uuid: string;
}
