import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateWalletDto, RegisterUserDto, CreateUserDto } from './dto';
import { Wallet } from 'src/wallet/wallet.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { isHex } from '@polkadot/util';
import { validateSignature } from 'src/utils/validate-signature';
import { JwtService } from '@nestjs/jwt';
import { Nonce, UserProfile } from 'src/interfaces';

const NonceGenerator = require('a-nonce-generator');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterUserDto) {
    const id = data.walletAddress;
    const exist = await this.walletRepository.exist({ where: { id } });
    if (exist) {
      throw new HttpException('WalletIsRegistered', HttpStatus.FORBIDDEN);
    }

    try {
      const registerData = new RegisterUserDto(data);
      const walletData = new CreateWalletDto({
        id: registerData.walletAddress,
        blockchainPlatform: registerData.blockchainPlatform,
        name: registerData.walletName,
      });
      const userData = new CreateUserDto({
        name: registerData.name,
        email: registerData.email,
      });
      const user = this.userRepository.create(userData);
      const result = await this.userRepository.insert(user);
      const wallet = this.walletRepository.create(walletData);
      user.id = result.identifiers[0].id;
      wallet.userId = user.id;
      await this.walletRepository.insert(wallet);
      user.wallets = [wallet];
      return user;
    } catch (e) {
      if (['23502', '23503', '23505'].includes(e.code)) {
        throw new HttpException(e.message, HttpStatus.CONFLICT);
      }

      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(data: LoginUserDto): Promise<UserProfile> {
    const [address, account] = data.address.split('/');
    const nearAccount = isHex(`0x${account}`) ? `0x${account}` : account;
    const wallet = await this.walletRepository.findOne({
      relations: ['user'],
      where: { id: nearAccount ?? address },
    });

    if (!wallet) {
      throw new HttpException('WalletNotFound', HttpStatus.NOT_FOUND);
    }

    const user = wallet.user;
    const isValid = await validateSignature(
      wallet.id,
      wallet.user.nonce,
      data.signature,
      data.walletType,
    );

    if (!isValid) {
      throw new HttpException('InvalidSignature', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      id: user.id,
      name: user.name,
      address: wallet.id,
      createdAt: user.createdAt,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const ng = new NonceGenerator();
    const n = ng.generate();

    await this.userRepository.update({ id: wallet.userId }, { nonce: n });

    return {
      user: {
        id: wallet.userId,
        address: wallet.id,
      },
      token: { accessToken },
    };
  }

  async nonce(address: string): Promise<Nonce> {
    if (!address) return { nonce: '0' };

    try {
      const wallet = await this.walletRepository.findOne({
        where: {
          id: address,
        },
        relations: ['user'],
      });

      if (!wallet) {
        return { nonce: '0' };
      }

      return { nonce: wallet.user.nonce };
    } catch (e) {
      // ignore
    }

    return { nonce: '0' };
  }
}
