import { BlockchainPlatform } from 'src/enums';

export class CreateWalletDto {
  id: string;
  name: string;
  blockchainPlatform: BlockchainPlatform;

  constructor(data: Partial<CreateWalletDto>) {
    Object.assign(this, data);
  }
}
