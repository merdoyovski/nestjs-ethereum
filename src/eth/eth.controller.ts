import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EthService } from './eth.service';

import { SortedBalancesEthDto } from './dto/sortedBalances-eth.dto';

@Controller('eth')
export class EthController {
  constructor(private readonly ethService: EthService) {}

  @Post('sortedBalances')
  async getSortedBalances(@Body() createEthDto: SortedBalancesEthDto) {
    const result = await this.ethService.SortedBalances(createEthDto);
    if (result === null) {
      throw new HttpException(
        'Failed to get balances. Provider could be down.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const { validAddresses, invalidAddresses } = result;

    return {
      'wrong_addresses: ': invalidAddresses,
      'sorted_addresses: ': validAddresses,
    };
  }
}
