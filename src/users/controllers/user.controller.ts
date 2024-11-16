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
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';
import { GetUserQueryDto } from '../../shared/pipes/getUser.pipe';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @ApiOperation({ summary: 'Get User by email or full name' })
  @ApiQuery({ name: 'email', type: String, required: false, description: 'User email' })
  @ApiQuery({ name: 'firstName', type: String, required: false, description: 'User first name' })
  @ApiQuery({ name: 'lastName', type: String, required: false, description: 'User last name' })
  async getUserByParams(@Query(new ValidationPipe({ transform: true })) query: GetUserQueryDto) {
    const { email, firstName, lastName } = query;

    if (email) {
      return await this.userService.getByEmail(email);
    }
    if (firstName && lastName) {
      return await this.userService.getByFullName(firstName, lastName);
    }

    throw new BadRequestException('Provide either email or both firstName and lastName');
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create User' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService
      .createUser(createUserDto)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update User' })
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService
      .updateUser(id, updateUserDto)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw new BadRequestException(`Неудачное изменение пользователя`);
      });
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete User' })
  async deleteUser(@Param('id') id: number) {
    return await this.userService
      .deleteUser(id)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw new BadRequestException(`Неудачное удаление пользователя`);
      });
  }
}
