import { IsUUID, IsNumber, IsArray, ValidateNested, IsString, IsOptional, IsPositive, Min, ArrayNotEmpty, MaxLength, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @IsUUID()
    product_uuid: string;

    @IsString()
    name: string;

    @IsString()
    description?: string;

    @IsString()
    image_url?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsUUID()
    cart_uuid: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    total_price: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    order_address: string;

    @IsArray()
    @ArrayNotEmpty({ message: 'Order must have at least one item' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}