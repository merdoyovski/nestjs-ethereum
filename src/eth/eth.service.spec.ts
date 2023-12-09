import { Test, TestingModule } from '@nestjs/testing';
import { EthService } from './eth.service';
import { HttpModule } from '@nestjs/axios';
import { ethers } from 'ethers';

const mockProvider = {
  getBlockNumber: jest.fn(),
  getBalance: jest.fn(),
};

describe('EthService', () => {
  let service: EthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        EthService,
        {
          provide: 'EthersJS:Provider:default',
          //provide: getEthersToken(EthService.name),
          useValue: mockProvider,
        },
      ],
    }).compile();

    service = module.get<EthService>(EthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('SortedBalances', () => {
    it(
      'should return sorted balances (mocked balances)',
      async () => {
        const mockEthDto = {
          addresses: [
            '0x00000000219ab540356cBB839Cbe05303d7705Fa',
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          ],
        };

        const mockBalances = {
          validAddresses: [
            {
              address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
              eth_balance: 2,
              usd_balance: 4,
            },
            {
              address: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
              eth_balance: 1,
              usd_balance: 2,
            },
          ],
          invalidAddresses: [],
        };

        const oracleEthPrice: number = 2;

        jest.spyOn(service, 'getEthUsd').mockResolvedValueOnce(oracleEthPrice); // Mock the USD price
        jest
          .spyOn(mockProvider, 'getBlockNumber')
          .mockResolvedValue(
            ethers.getDefaultProvider('homestead').getBlockNumber(),
          );
        jest
          .spyOn(mockProvider, 'getBalance')
          .mockResolvedValueOnce(ethers.parseEther('1'));
        jest
          .spyOn(mockProvider, 'getBalance')
          .mockResolvedValueOnce(ethers.parseEther('2'));

        const result = await service.SortedBalances(mockEthDto);

        expect(result).toEqual(mockBalances);
      },
      30 * 1000,
    );

    // correct address

    // eth balance not negative

    // integration with jsonrpcprovider

    it(
      'should return sorted balances',
      async () => {
        const mockEthDto = {
          addresses: [
            'invAddr1',
            'invAddr2',
            '0x00000000219ab540356cBB839Cbe05303d7705Fa',
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            '0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf',
          ],
        };

        jest
          .spyOn(mockProvider, 'getBlockNumber')
          .mockResolvedValue(
            ethers.getDefaultProvider('homestead').getBlockNumber(),
          );
        jest
          .spyOn(mockProvider, 'getBalance')
          .mockImplementation(async (address: string) => {
            const balance = await ethers
              .getDefaultProvider('homestead')
              .getBalance(address);
            return balance;
          });

        const result = await service.SortedBalances(mockEthDto);

        const validAddresses = result.validAddresses;
        const mockBalances = {
          validAddresses,
          invalidAddresses: ['invAddr1', 'invAddr2'],
        };

        // The spread operator is used to ensure original array is not changed, otherwise this test will always pass
        expect(validAddresses).toStrictEqual(
          [...validAddresses].sort((a, b) => {
            return b.eth_balance - a.eth_balance;
          }),
        );
        expect(result).toEqual(mockBalances);
      },
      450 * 1000,
    );

    it(
      'should return invalid addresses',
      async () => {
        const mockEthDto = {
          addresses: ['invAddr1', 'invAddr2'],
        };

        const mockBalances = {
          validAddresses: [],
          invalidAddresses: ['invAddr1', 'invAddr2'],
        };

        const result = await service.SortedBalances(mockEthDto);

        expect(result).toEqual(mockBalances);
      },
      15 * 1000,
    );

    it(
      'should return the correct type for USD price',
      async () => {
        const result = await service.getEthUsd();
        expect(result).toEqual(expect.any(Number));
        expect(result).toBeGreaterThanOrEqual(0);
      },
      15 * 1000,
    );

    it(
      'should handle error and return null',
      async () => {
        const mockEthDto = {
          addresses: ['address1', 'address2'],
        };

        jest
          .spyOn(service, 'getEthUsd')
          .mockRejectedValueOnce(new Error('Network error'));

        const result = await service.SortedBalances(mockEthDto);

        expect(result).toBeNull();
      },
      35 * 1000,
    );
  });
});
