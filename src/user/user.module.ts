import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { UserController, UserWalletController } from './controllers';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet])],
  controllers: [UserController, UserWalletController],
  providers: [UserService, WalletService, JwtService],
})
export class UserModule {}
