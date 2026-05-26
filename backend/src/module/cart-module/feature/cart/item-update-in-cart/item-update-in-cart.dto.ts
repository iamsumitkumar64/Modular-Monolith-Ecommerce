import { IsUUID, IsInt, IsOptional } from 'class-validator';

export class ItemUpdateInCartDto {
    @IsUUID()
    item_uuid: string;

    @IsInt({ message: 'Quantity must be an integer' })
    @IsOptional()
    quantity?: number;
}
