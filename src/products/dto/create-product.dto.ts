import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'NAME_REQUIRED' })
  @IsNotEmpty({ message: 'NAME_NOT_EMPTY' })
  name: string;

  @IsNumber({}, { message: 'PRICE_INVALID' })
  @IsPositive({ message: 'PRICE_POSITIVE' })
  @IsNotEmpty({ message: 'PRICE_NOT_EMPTY' })
  price: number;
}
