import { ApiProperty } from '@nestjs/swagger';

export class DeleteAvatarResponseDto {
  @ApiProperty({ example: 'Avatar deleted' })
  message: string;
}
