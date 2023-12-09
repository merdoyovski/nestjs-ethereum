import { Injectable, Logger } from '@nestjs/common';
import { SortedBalancesEthDto } from './dto/sortedBalances-eth.dto';
import { ethers, JsonRpcProvider } from 'ethers';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IEthBalance } from './interfaces/eth.interface';
import { InjectEthersProvider } from 'nestjs-ethers';

@Injectable()
export class EthService {
  constructor(
    @InjectEthersProvider()
    private readonly provider: JsonRpcProvider,
    private readonly httpService: HttpService,
  ) {}

  async SortedBalances(sortedBalancesEthDto: SortedBalancesEthDto) {
    const addressesToCheck: string[] = sortedBalancesEthDto.addresses;

    const validAddresses: IEthBalance[] = [];
    const invalidAddresses: string[] = [];

    // It's important to get the latest block number before iterating over the addresses. Because eventhough they are supposed to be parallel, the latest block can change while iterating over the addresses.

    // Instead of iterating over the addresses, we can use Promise.all to speed up the process.
    try {
      const latestBlock = await this.provider.getBlockNumber();

      const ethPrice = await this.getEthUsd();

      await Promise.all(
        addressesToCheck.map(async (address) => {
          if (ethers.isAddress(address)) {
            const balance = await this.provider.getBalance(
              address,
              latestBlock,
            );
            const balanceInEth = ethers.formatEther(balance.toString());
            const validAddr: IEthBalance = {
              address: address,
              eth_balance: Number(balanceInEth),
              usd_balance: Number(balanceInEth) * Number(ethPrice),
            };

            validAddresses.push(validAddr);
          } else {
            invalidAddresses.push(address);
          }
        }),
      );
    } catch (error) {
      Logger.error('Error getting balances: ' + error, 'EthService');
      return null;
    }

    validAddresses.sort((a, b) => {
      return b.eth_balance - a.eth_balance;
    });

    return { invalidAddresses, validAddresses };
  }

  async getEthUsd(): Promise<number> {
    const oracleUrl =
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

    const { data } = await firstValueFrom(
      this.httpService.get(oracleUrl).pipe(),
    );
    return data.ethereum.usd;
  }
}
