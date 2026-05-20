import { IsNotEmpty, IsNumber, Min, IsOptional, IsString, ValidateNested } from 'class-validator';

export class PayDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsString()
    card_uuid: string;
}