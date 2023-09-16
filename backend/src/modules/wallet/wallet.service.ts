import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { CreateWalletDto } from 'src/modules/user/dto';
import { CreateWalletDto as CreateWallet, DeleteWalletDto } from './dto';
import { validateSignature } from 'src/utils/validate-signature';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async find(id: number): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { userId: id },
    });
  }

  async deleteById(
    id: number,
    data: DeleteWalletDto,
  ): Promise<{ count: number }> {
    const wallet = await this.walletRepository.findOne({
      where: { id: data.addresss, userId: id },
      relations: ['user'],
    });

    if (!wallet) {
      throw new HttpException('WalletNotFound', HttpStatus.NOT_FOUND);
    }

    const isValid = await validateSignature(
      wallet.id,
      wallet.user.nonce,
      data.signature,
      data.walletType,
    );

    if (!isValid) {
      throw new HttpException('Invalid Signature', HttpStatus.UNAUTHORIZED);
    }

    const result = await this.walletRepository.delete({ id: data.addresss });
    return { count: result.affected };
  }

  async create(id: number, data: CreateWalletDto): Promise<Wallet> {
    try {
      const walletData = new CreateWallet({
        id: data.id,
        blockchainPlatform: data.blockchainPlatform,
        name: data.name,
      });
      const wallet = this.walletRepository.create(walletData);
      wallet.userId = id;
      await this.walletRepository.insert(wallet);
      return wallet;
    } catch (e) {
      throw e;
    }
  }
}
