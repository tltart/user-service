import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { AddresService } from './services/addresses.service';
import { AdresController } from './controllers/address.controller';
import { User } from 'src/users/entitties/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User])],
  providers: [AddresService],
  controllers: [AdresController],
  exports: [AddresService]
})
export class AdresModule {}
