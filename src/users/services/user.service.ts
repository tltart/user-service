import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitties/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ReadUserDto } from '../dto/read-user.dto';
import { pickObjKeys } from '../../shared/helpers/helper';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Address } from '../../address/entities/address.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  async createUser(user: CreateUserDto): Promise<ReadUserDto> {
    await this.checkNewUser(user.email, user.phone);

    const createUserDto = this.toRegisterUserDto(user);

    let workAddress = null;
    let homeAddress = null;

    if (createUserDto.workAddress) {
      workAddress = this.addressRepository.create(createUserDto.workAddress);
    }
    if (createUserDto.homeAddress) {
      homeAddress = this.addressRepository.create(createUserDto.homeAddress);
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

  toReadUserDto(v: any): ReadUserDto {
    return pickObjKeys(
      <ReadUserDto>v,
      'id',
      'email',
      'firstName',
      'lastName',
      'phone',
      'homeAddress',
      'workAddress',
    );
  }

  private async checkNewUser(email: string, phone: string): Promise<void> {
    if (await this.userRepository.findOne({ where: [{ email }, { phone }] }))
      throw new BadRequestException(
        'Пользователь с таким email или номером телефона уже существует',
      );
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
    const user = await this.userRepository.findOne({ where: { id } });
    return this.toReadUserDto(user);
  }

  async updateUser(
    id: number,
    user: UpdateUserDto,
  ): Promise<{ old: ReadUserDto; new: ReadUserDto }> {
    const oldUser = this.toReadUserDto(await this.getUserById(id));

    if (!oldUser) throw new BadRequestException(`Пользователь с id: ${id} не существует`);

    const editUserDto = this.toUpdateUserDto(user);
    const editedUser = await this.userRepository.update(id, editUserDto);
    if (!editedUser)
      throw new InternalServerErrorException('Пользователь не может быть отредактирован');

    const editedUserRow = await this.userRepository.findOne({ where: { id } });

    const readUserDto = this.toReadUserDto(editedUserRow);

    // await this.setRecordToCache(readUserDto);

    return { old: oldUser, new: readUserDto };
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (!result || !result.affected)
      throw new InternalServerErrorException('Пользователь не может быть удален');
  }

  toUpdateUserDto(v: any): UpdateUserDto {
    return pickObjKeys(<UpdateUserDto>v, 'email', 'firstName', 'lastName', 'phone');
  }
}
