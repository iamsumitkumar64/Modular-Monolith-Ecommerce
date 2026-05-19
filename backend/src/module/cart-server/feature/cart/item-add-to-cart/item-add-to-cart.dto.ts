import { IsUUID, IsInt, IsOptional } from 'class-validator';

export class ItemAddToCartDto {
    @IsUUID()
    @IsOptional()
    product_uuid: string;

    @IsInt({ message: 'Quantity must be an integer' })
    @IsOptional()
    quantity?: number;
}