import { IsUUID, IsInt, IsOptional } from 'class-validator';

export class ItemRemoveFromCartDto {
    @IsUUID()
    item_uuid: string;

    @IsUUID()
    cart_uuid: string;
}
