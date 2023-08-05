import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsAddress } from 'src/decorators';
import { WalletType } from 'src/enums';

export class DeleteWalletDto {
  @ApiProperty({
    name: 'walletAddress',
    required: true,
    default:
      '0xd88ceaa9fa037f70ed640d936ba18f0c7127b43a3baf41695beb2f2f8d876862',
  })
  @IsString()
  @IsNotEmpty()
  @IsAddress('walletType', { message: 'InvalidAddress' })
  addresss: string;

  @ApiProperty({
    name: 'signature',
    required: true,
    default:
      '0x1a103d53e0a70c2b7727fa01eba263262c67a5ba097c4d2a549de59c6381b2247a0ece7671721532a9f14d5b5e20a7ac96b76806ebf40424dc8f7d74862f2a82',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({ name: 'walletType', enum: WalletType, required: true })
  @IsString()
  @IsNotEmpty()
  @IsEnum(WalletType)
  walletType: WalletType;
}
