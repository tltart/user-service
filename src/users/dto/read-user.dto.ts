import { ReadAddressDto } from '../../address/dto/read-address.dto';

export class ReadUserDto {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  workAddress: ReadAddressDto;
  homeAddress: ReadAddressDto;
}
