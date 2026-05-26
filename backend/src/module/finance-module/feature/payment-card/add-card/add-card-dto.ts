import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class AddCardDto {
    @IsNotEmpty()
    @IsString()
    name_on_card: string;

    @IsNotEmpty()
    @IsString()
    @Length(12, 24)
    card_number: string;

    @IsOptional()
    @IsString()
    @Length(1, 2)
    expiry_month?: string;

    @IsOptional()
    @IsString()
    @Length(2, 4)
    expiry_year?: string;
}