import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ required: true, minLength: 2, maxLength: 50, example: 'Москва' })
  @IsString({ message: 'Название города не может быть пустым' })
  @MaxLength(50)
  @IsNotEmpty()
  readonly town: string;

  @ApiProperty({ required: true, minLength: 2, maxLength: 50, example: 'Ленина' })
  @IsString({ message: 'Название улицы не может быть пустым' })
  @MaxLength(50)
  @IsNotEmpty()
  readonly street: string;

  @ApiProperty({ required: true, minLength: 2, maxLength: 10, example: '43' })
  @IsString({ message: 'Номер дома не может быть пустым' })
  @IsNotEmpty()
  readonly houseNumber: string;
}
