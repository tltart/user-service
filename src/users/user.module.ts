import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitties/user.entity';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AddresService } from '../address/services/addresses.service';
import { Address } from 'src/address/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UserService, AddresService],
  controllers: [UserController],
})
export class UserModule {}
