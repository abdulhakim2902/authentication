import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BlockchainPlatform } from 'src/enums';
import { User } from 'src/modules/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryColumn({ type: 'varchar', name: 'id' })
  @ApiProperty({
    name: 'id',
    default:
      '0xd88ceaa9fa037f70ed640d936ba18f0c7127b43a3baf41695beb2f2f8d876862',
  })
  id: string;

  @ApiProperty({ name: 'name', default: 'John Doe' })
  @Column({ type: 'varchar', name: 'name', nullable: true })
  name: string;

  @ApiProperty({ name: 'blockchainPlatform', enum: BlockchainPlatform })
  @Column({
    type: 'enum',
    enum: BlockchainPlatform,
    name: 'blockchain_platform',
  })
  blockchainPlatform: BlockchainPlatform;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @ApiProperty({ name: 'createdAt', default: new Date() })
  @CreateDateColumn({ type: 'date', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ name: 'updatedAt', default: new Date() })
  @UpdateDateColumn({ type: 'date', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
