import { ApiProperty } from '@nestjs/swagger';

export class AvatarDto {
  @ApiProperty({ example: '42-1695412345678.webp' })
  filename: string;

  @ApiProperty({ example: '/uploads/avatars/42-1695412345678.webp' })
  url: string;
}
