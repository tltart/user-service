import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { ReadAddressDto } from '../dto/read-address.dto';
import { pickObjKeys } from '../../shared/helpers/helper';

@Injectable()
export class AddresService {
  constructor(@InjectRepository(Address) private addressRepository: Repository<Address>) {}

  async createAddress(address: CreateAddressDto): Promise<ReadAddressDto> {
    if (await this.checkAddress(address)) throw new BadRequestException('Адрес существует');

    const newAddress = this.addressRepository.create(address);
    await this.addressRepository.save(newAddress);

    if (!newAddress) throw new InternalServerErrorException('Адрес не может быть создан');

    const adresReadDto = this.toReadAddressDto(newAddress);
    // await this.setRecordToCache(readUserDto);

    return adresReadDto;
  }

  toReadAddressDto(v: any): ReadAddressDto {
    const readAddressDto: ReadAddressDto = {
      id: v.id,
      town: v.town,
      street: v.street,
      houseNumber: v.houseNumber,
      users: v.users?.map((user: any) => user) || [],
    };

    return readAddressDto;
  }

  async checkAddress(address: CreateAddressDto): Promise<Address> {
    return this.addressRepository.findOne({
      where: {
        town: address.town,
        street: address.street,
        houseNumber: address.houseNumber,
      },
    });
  }

  async getAdresById(id: number): Promise<Address> {
    return this.addressRepository.findOne({ where: { id } });
  }

  async updateAddress(
    id: number,
    address: UpdateAddressDto,
  ): Promise<{ old: ReadAddressDto; new: ReadAddressDto }> {
    await this.checkUpdateAddress(id);

    const oldAddress = this.toReadAddressDto(await this.getAdresById(id));

    const editAddressDto = this.toUpdateAddressDto(address);
    const editedAddress = await this.addressRepository.update(id, editAddressDto);
    if (!editedAddress)
      throw new InternalServerErrorException('Адрес не может быть отредактирован');

    const editedAddressRow = await this.addressRepository.findOne({ where: { id } });

    const readAddressDto = this.toReadAddressDto(editedAddressRow);

    // await this.setRecordToCache(readUserDto);

    return { old: oldAddress, new: readAddressDto };
  }

  async deleteAddress(id: number): Promise<void> {
    const result = await this.addressRepository.delete(id);
    if (!result || !result.affected)
      throw new InternalServerErrorException('Адрес не может быть удален');
  }

  async getAddress(id: number): Promise<ReadAddressDto> {
    const address = await this.addressRepository.findOne({ where: { id }, relations: ['users'] });
    return this.toReadAddressDto(address);
  }

  private async checkUpdateAddress(id: number): Promise<void> {
    const existAdres = await this.addressRepository.findOne({ where: { id } });
    if (!existAdres) throw new BadRequestException(`Не найден адрес с id: ${id}`);
  }

  toUpdateAddressDto(v: any): UpdateAddressDto {
    return pickObjKeys(<UpdateAddressDto>v, 'town', 'street', 'houseNumber');
  }
}
