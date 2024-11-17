import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitties/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ReadUserDto } from '../dto/read-user.dto';
import { pickObjKeys } from '../../shared/helpers/helper';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AddresService } from '../../address/services/addresses.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private addressService: AddresService,
  ) {}

  async createUser(user: CreateUserDto): Promise<ReadUserDto> {
    await this.checkNewUser(user.email, user.phone);

    let workAddress = null;
    let homeAddress = null;

    const createUserDto = this.toRegisterUserDto(user);

    if (createUserDto.workAddress) {
      workAddress =
        (await this.addressService.checkAddress(createUserDto.workAddress)) ||
        (await this.addressService.createAddress(createUserDto.workAddress));
    }
    if (createUserDto.homeAddress) {
      homeAddress =
        (await this.addressService.checkAddress(createUserDto.homeAddress)) ||
        (await this.addressService.createAddress(createUserDto.homeAddress));
    }

    const createdUser = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phone: createUserDto.phone,
      addresses: [workAddress && workAddress, homeAddress && homeAddress],
    });

    const savedUser = await this.userRepository.save(createdUser);

    if (!savedUser) throw new InternalServerErrorException('Пользователь не может быть создан');

    const readUserDto = this.toReadUserDto(savedUser);

    // await this.setRecordToCache(readUserDto);

    return readUserDto;
  }

  private async checkNewUser(email: string, phone: string): Promise<void> {
    if (await this.userRepository.findOne({ where: [{ email }, { phone }] }))
      throw new BadRequestException(
        'Пользователь с таким email или номером телефона уже существует',
      );
  }

  async getByEmail(email: string): Promise<ReadUserDto | {}> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['addresses'] });
    
    if (!user) return {};
    return this.toReadUserDto(user);
  }

  async getByFullName(firstName: string, lastName: string): Promise<ReadUserDto[] | []> {
    const users = await this.userRepository.find({
      where: { firstName, lastName },
      relations: ['addresses'],
    });
    if (!users) return [];
    const usersReadDto = users.map((user) => this.toReadUserDto(user));
    return usersReadDto;
  }

  async getUserById(id: number): Promise<ReadUserDto> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['addresses'], });
    return this.toReadUserDto(user);
  }

  async updateUser(
    id: number,
    user: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const oldUser = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses'],
    });
  
    if (!oldUser) {
      throw new BadRequestException(`Пользователь с id: ${id} не существует`);
    }
  
    const editUserDto = this.toUpdateUserDto(user);
  
    let workAddress = null;
    let homeAddress = null;
  
    if (editUserDto.workAddress) {
      workAddress =
        (await this.addressService.checkAddress(editUserDto.workAddress)) ||
        (await this.addressService.createAddress(editUserDto.workAddress));
    }
    if (editUserDto.homeAddress) {
      homeAddress =
        (await this.addressService.checkAddress(editUserDto.homeAddress)) ||
        (await this.addressService.createAddress(editUserDto.homeAddress));
    }
  
    await this.userRepository.update(id, {
      firstName: editUserDto.firstName,
      lastName: editUserDto.lastName,
      email: editUserDto.email,
      phone: editUserDto.phone,
    });
  
    if (workAddress) {
      oldUser.addresses[0] = workAddress;
    }
    if (homeAddress) {
      oldUser.addresses[1] = homeAddress;
    }
  
    const updatedUser = await this.userRepository.save(oldUser);
  
    const readUserDto = this.toReadUserDto(updatedUser);
  
    return readUserDto;
  }
  

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (!result || !result.affected)
      throw new InternalServerErrorException('Пользователь не может быть удален');
  }

  toReadUserDto(v: any): ReadUserDto {
    const userDto = pickObjKeys(
      <ReadUserDto>v,
      'id',
      'email',
      'firstName',
      'lastName',
      'phone'
    ) as ReadUserDto;
  
    if (v.addresses && Array.isArray(v.addresses)) {
      userDto.homeAddress = v.addresses[0] || {};
      userDto.workAddress = v.addresses[1] || {};
    }
  
    return userDto;
  }

  toRegisterUserDto(v: CreateUserDto): CreateUserDto {
    const userDto: CreateUserDto = pickObjKeys(v, 'email', 'firstName', 'lastName', 'phone');

    if (v.workAddress) {
      userDto.workAddress = v.workAddress;
    }

    if (v.homeAddress) {
      userDto.homeAddress = v.homeAddress;
    }

    return userDto;
  }

  toUpdateUserDto(v: any): UpdateUserDto {
    const userDto: UpdateUserDto = pickObjKeys(v, 'email', 'firstName', 'lastName', 'phone');

    if (v.workAddress) {
      userDto.workAddress = v.workAddress;
    }

    if (v.homeAddress) {
      userDto.homeAddress = v.homeAddress;
    }

    return userDto;
  }
}
