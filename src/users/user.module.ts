import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitties/user.entity';
import { Address } from '../address/entities/address.entity';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
