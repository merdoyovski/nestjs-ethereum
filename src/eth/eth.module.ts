import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EthService } from './eth.service';
import { EthController } from './eth.controller';
import { EthersModule } from 'nestjs-ethers';

@Module({
  imports: [HttpModule, EthersModule.forRoot({ useDefaultProvider: true })],
  controllers: [EthController],
  providers: [EthService],
})
export class EthModule {}
