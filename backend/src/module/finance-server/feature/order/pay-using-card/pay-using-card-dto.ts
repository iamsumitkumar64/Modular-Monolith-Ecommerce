import { IsNotEmpty, IsNumber, Min, IsOptional, IsString, ValidateNested } from 'class-validator';

export class PayUsingCardDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsString()
    @IsNotEmpty()
    card_uuid: string;

    @IsString()
    @IsNotEmpty()
    order_uuid: string;
}