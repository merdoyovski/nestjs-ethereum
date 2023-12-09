import { Test, TestingModule } from '@nestjs/testing';
import { EthController } from './eth.controller';
import { EthService } from './eth.service';
import { HttpModule } from '@nestjs/axios';
import { getEthersToken } from 'nestjs-ethers';
import { EthModule } from './eth.module';

describe('EthController', () => {
  let controller: EthController;
  let service: EthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EthModule, HttpModule],
      controllers: [EthController],
      providers: [
        EthService,
        {
          provide: getEthersToken(EthService.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<EthController>(EthController);
    service = module.get<EthService>(EthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSortedBalances', () => {
    it('should return received addresses in correct format', async () => {
      const mockEthDto = {
        addresses: ['addr1', 'addr2', 'invalidAddr1', 'invalidAddr2'],
      };

      const mockResult = {
        validAddresses: [
          { address: 'addr1', eth_balance: 3, usd_balance: 6 },
          { address: 'addr2', eth_balance: 1, usd_balance: 2 },
        ],
        invalidAddresses: ['invalidAddr1', 'invalidAddr2'],
      };

      jest.spyOn(service, 'SortedBalances').mockResolvedValueOnce(mockResult);

      const result = await controller.getSortedBalances(mockEthDto);

      expect(result).toEqual({
        'wrong_addresses: ': ['invalidAddr1', 'invalidAddr2'],
        'sorted_addresses: ': [
          { address: 'addr1', eth_balance: 3, usd_balance: 6 },
          { address: 'addr2', eth_balance: 1, usd_balance: 2 },
        ],
      });
    });

    it('should handle error and return SERVICE_UNAVAILABLE', async () => {
      const mockEthDto = {
        addresses: ['addr1', 'addr2', 'invalidAddr1', 'invalidAddr2'],
      };

      const mockResult = null;

      jest.spyOn(service, 'SortedBalances').mockResolvedValueOnce(mockResult);

      expect(controller.getSortedBalances(mockEthDto)).rejects.toThrow(
        'Failed to get balances. Provider could be down.',
      );
    });
  });
});
