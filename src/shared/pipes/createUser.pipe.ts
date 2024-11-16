import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@ValidatorConstraint({ async: false })
export class AtLeastOneAddressFilledConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const { object } = args;

    const user: CreateUserDto = object as CreateUserDto;
    const workAddress: CreateAddressDto = user.workAddress;
    const homeAddress: CreateAddressDto = user.homeAddress;

    if (workAddress && homeAddress) {
      if (
        workAddress.town &&
        workAddress.street &&
        workAddress.houseNumber &&
        homeAddress.town &&
        homeAddress.street &&
        homeAddress.houseNumber
      ) {
        return true;
      }
    }

    if (workAddress) {
      if (workAddress.town && workAddress.street && workAddress.houseNumber) {
        return true;
      }
    }

    if (homeAddress) {
      if (homeAddress.town && homeAddress.street && homeAddress.houseNumber) {
        return true;
      }
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'At least one address (workAddress or homeAddress) must be fully filled out';
  }
}
