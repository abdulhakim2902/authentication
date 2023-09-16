import { IsNotEmpty } from 'class-validator';
import { BlockchainPlatform } from 'src/enums';

export class CreateWalletDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  blockchainPlatform: BlockchainPlatform;

  name: string;

  constructor(data: Partial<CreateWalletDto>) {
    Object.assign(this, data);
  }
}
