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
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  async createAddress(adres: CreateAddressDto): Promise<ReadAddressDto> {
    await this.checkNewAdres(adres);

    const newAddress = this.addressRepository.create(adres);
    await this.addressRepository.save(newAddress);

    if (!newAddress) throw new InternalServerErrorException('Адрес не может быть создан');

    const adresReadDto = this.toReadAddressDto(newAddress);
    // await this.setRecordToCache(readUserDto);

    return adresReadDto;
  }

  toReadAddressDto(v: any): ReadAddressDto {
    return pickObjKeys(<ReadAddressDto>v, 'id', 'town', 'street', 'houseNumber');
  }

  private async checkNewAdres(adres: CreateAddressDto): Promise<void> {
    if (
      await this.addressRepository.findOne({
        where: {
          town: adres.town,
          street: adres.street,
          houseNumber: adres.houseNumber,
        },
      })
    )
      throw new BadRequestException('Адрес существует');
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
    if (!editedAddress) throw new InternalServerErrorException('Адрес не может быть отредактирован');

    const editedAddressRow = await this.addressRepository.findOne({ where: { id } });

    const readAddressDto = this.toReadAddressDto(editedAddressRow);

    // await this.setRecordToCache(readUserDto);

    return { old: oldAddress, new: readAddressDto };
  }

  async deleteAddress(id: number): Promise<void> {
    const result = await this.addressRepository.delete(id);
    if (!result || !result.affected) throw new InternalServerErrorException('Адрес не может быть удален');
  }

  private async checkUpdateAddress(id: number): Promise<void> {
    const existAdres = await this.addressRepository.findOne({ where: { id } });
    if (!existAdres) throw new BadRequestException(`Не найден адрес с id: ${id}`);
  }

  toUpdateAddressDto(v: any): UpdateAddressDto {
    return pickObjKeys(<UpdateAddressDto>v, 'town', 'street', 'houseNumber');
  }
}
