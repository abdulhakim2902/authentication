import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsAddress } from 'src/decorators';
import { BlockchainPlatform, WalletType } from 'src/enums';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ name: 'name', default: 'John Doe', required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ name: 'email', default: 'johndoe@mail.com', required: true })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    name: 'walletAddress',
    required: true,
    default:
      '0xd88ceaa9fa037f70ed640d936ba18f0c7127b43a3baf41695beb2f2f8d876862',
  })
  @IsString()
  @IsNotEmpty()
  @IsAddress('walletType', { message: 'InvalidAddress' })
  walletAddress: string;

  @ApiProperty({ name: 'walletType', enum: WalletType, required: true })
  @IsString()
  @IsNotEmpty()
  @IsEnum(WalletType)
  walletType: WalletType;

  @IsOptional()
  blockchainPlatform: BlockchainPlatform;

  @ApiProperty({ name: 'walletName', default: 'John Doe', required: false })
  @IsOptional()
  walletName: string;

  constructor(data: Partial<RegisterUserDto>) {
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
