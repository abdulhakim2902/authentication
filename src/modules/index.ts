import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UserController, UserWalletController } from './user/controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Wallet } from 'ethers';
import { AuthService } from './auth/auth.service';
import { WalletService } from './wallet/wallet.service';
import { UserService } from './user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('SECRET_KEY'),
      }),
    }),
    TypeOrmModule.forFeature([User, Wallet]),
  ],
  controllers: [AuthController, UserController, UserWalletController],
  providers: [
    AuthService,
    JwtService,
    UserService,
    WalletService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class Modules {}
