import { ArrayNotEmpty } from 'class-validator';

export class SortedBalancesEthDto {
  // This handles both IsArray and ArrayNotEmpty
  @ArrayNotEmpty({ message: 'Addresses array cannot be empty' })
  addresses: string[];
}
