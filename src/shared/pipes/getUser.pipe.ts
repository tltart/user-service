import { IsEmail, IsString, ValidateIf, IsNotEmpty } from 'class-validator';

export class GetUserQueryDto {
  @ValidateIf((dto) => !dto.firstName && !dto.lastName)
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty if name fields are not provided' })
  email?: string;

  @ValidateIf((dto) => !dto.email)
  @IsString()
  @IsNotEmpty({ message: 'First name cannot be empty if email is not provided' })
  firstName?: string;

  @ValidateIf((dto) => !dto.email)
  @IsString()
  @IsNotEmpty({ message: 'Last name cannot be empty if email is not provided' })
  lastName?: string;
}
