import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { AddresService } from './services/addresses.service';
import { AdresController } from './controllers/address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddresService],
  controllers: [AdresController],
})
export class AdresModule {}
