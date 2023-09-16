import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsAddress } from 'src/decorators';
import { BlockchainPlatform, WalletType } from 'src/enums';

export class CreateWalletDto {
  @ApiProperty({
    name: 'id',
    required: true,
    default:
      '0xd88ceaa9fa037f70ed640d936ba18f0c7127b43a3baf41695beb2f2f8d876862',
  })
  @IsString()
  @IsNotEmpty()
  @IsAddress('walletType', { message: 'InvalidAddress' })
  id: string;

  @ApiProperty({
    name: 'walletType',
    required: true,
    enum: WalletType,
    default: WalletType.POLKADOTJS,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(WalletType)
  walletType: WalletType;

  @IsOptional()
  blockchainPlatform: BlockchainPlatform;

  @ApiProperty({ name: 'name', default: 'John Doe', required: false })
  @IsOptional()
  name: string;

  constructor(data: Partial<CreateWalletDto>) {
    Object.assign(this, data);
    this.setProvider();
  }

  private setProvider() {
    switch (this.walletType) {
      case WalletType.POLKADOTJS:
        this.blockchainPlatform = BlockchainPlatform.SUBSTRATE;
        break;
      case WalletType.METAMASK:
        this.blockchainPlatform = BlockchainPlatform.ETHEREUM;
        break;
      case WalletType.NEAR:
        this.blockchainPlatform = BlockchainPlatform.NEAR;
        break;
    }
  }
}
