import { ReadUserDto } from '../../users/dto/read-user.dto';
export class ReadAddressDto {
  readonly id: string;
  readonly town: string;
  readonly street: string;
  readonly houseNumber: string;
  users: Omit<ReadUserDto, 'workAddress' | 'homeAddress'>[];
}
