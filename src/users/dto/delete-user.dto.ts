import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  @ApiProperty({ required: true, example: true })
  @IsNumber()
  readonly id: number;
}
