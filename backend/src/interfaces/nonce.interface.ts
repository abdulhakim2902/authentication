import { ApiProperty } from '@nestjs/swagger';

export class Nonce {
  @ApiProperty({ name: 'nonce', default: '1032414' })
  nonce: string;
}
