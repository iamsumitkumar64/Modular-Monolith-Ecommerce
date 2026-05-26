import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddAmountDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    amount: number;
}