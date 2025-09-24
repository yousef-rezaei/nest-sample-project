import { ApiProperty } from '@nestjs/swagger';
import { AvatarDto } from './avatar.dto';

export class UploadAvatarResponseDto {
  @ApiProperty({ example: 'Avatar uploaded' })
  message: string;

  @ApiProperty({ type: AvatarDto })
  avatar: AvatarDto;
}
