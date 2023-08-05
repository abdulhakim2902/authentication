import { Exclude } from 'class-transformer';
import { Wallet } from 'src/wallet/wallet.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

const NonceGenerator = require('a-nonce-generator');

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ name: 'id', default: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ name: 'name', default: 'John Doe' })
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @ApiProperty({ name: 'email', default: 'johndoe@mail.com' })
  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'bigint', name: 'nonce' })
  nonce: string;

  @ApiProperty({ name: 'createdAt', default: new Date() })
  @CreateDateColumn({ type: 'date', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ name: 'updatedAt', default: new Date() })
  @UpdateDateColumn({ type: 'date', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @BeforeInsert()
  generateNonce() {
    const ng = new NonceGenerator();
    this.nonce = ng.generate();
  }
}
