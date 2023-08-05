import {
  Controller,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { WalletService } from 'src/wallet/wallet.service';
import { Wallet } from 'src/wallet/wallet.entity';
import { CreateWalletDto } from '../dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiFoundResponse,
} from '@nestjs/swagger';
import { DeleteWalletDto } from 'src/wallet/dto';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('users')
export class UserWalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/:id/wallets')
  @ApiFoundResponse({ type: Wallet, isArray: true })
  async find(@Param('id', ParseIntPipe) id: number): Promise<Wallet[]> {
    return this.walletService.find(id);
  }

  @Post('/:id/wallets')
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ type: Wallet })
  async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.addWallet(id, data);
  }

  @Delete('/:id/wallets')
  @UsePipes(ValidationPipe)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DeleteWalletDto,
  ): Promise<{ count: number }> {
    return this.walletService.deleteById(id, data);
  }
}
