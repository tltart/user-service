import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddresService } from '../services/addresses.service';

@ApiTags('adresses')
@Controller('adresses')
export class AdresController {
  private readonly logMeta = { module: 'AdressesController' };
  private readonly logLevel = 'info';

  constructor(
    private readonly addressService: AddresService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create address' })
  async createAdres(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressService
      .createAddress(createAddressDto)
      .then((address) => {
        return address;
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update address' })
  async updateAddress(@Param('id') id: number, @Body() updateAddressDto: UpdateAddressDto) {
    return await this.addressService
      .updateAddress(id, updateAddressDto)
      .then((address) => {
        return address;
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });

    }
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete address' })
  async deleteAddress(@Param('id') id: number) {
    return await this.addressService
      .deleteAddress(id)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }
  @Get('/:id')
  @ApiOperation({ summary: 'Get address by id' })
  async getAddress(@Param('id') id: number) {
    return await this.addressService
      .getAddress(id)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }
}
