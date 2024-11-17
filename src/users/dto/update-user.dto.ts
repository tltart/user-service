import { IsString, MinLength, MaxLength, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from '../../shared/decorators/isPhoneNumber.decorator';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class UpdateUserDto {
  @ApiProperty({ required: true, maxLength: 50, example: 'john@gmail.com' })
  @IsEmail({}, { message: 'Некорректный email' })
  @MaxLength(50)
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    required: true,
    maxLength: 300,
    example: 'John',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({
    required: true,
    maxLength: 300,
    example: 'Smith',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    required: true,
    example: '+1234567890',
  })
  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({ type: CreateAddressDto, required: false })
  workAddress?: CreateAddressDto;

  @ApiProperty({ type: CreateAddressDto, required: false })
  homeAddress?: CreateAddressDto;
}
