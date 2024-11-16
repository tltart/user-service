import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressDto {
  @ApiProperty({ required: false, minLength: 2, maxLength: 50, example: 'Москва' })
  @IsString({ message: 'Название города не может быть пустым' })
  @MaxLength(50)
  @IsOptional()
  readonly town: string;

  @ApiProperty({ required: false, minLength: 2, maxLength: 50, example: 'Ленина' })
  @IsString({ message: 'Название улицы не может быть пустым' })
  @MaxLength(50)
  @IsOptional()
  readonly street: string;

  @ApiProperty({ required: false, minLength: 1, maxLength: 10, example: '43' })
  @IsString({ message: 'Номер дома не может быть пустым' })
  @IsOptional()
  readonly houseNumber: string;
}
