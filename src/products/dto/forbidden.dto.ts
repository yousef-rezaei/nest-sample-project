import { ApiProperty } from '@nestjs/swagger';

export class ProductForbiddenResponseDto {
  @ApiProperty({
    type: String,
    description: 'Http error code',
    example: '403',
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: 'Description about the error',
    example: 'You do not have permission to access this resource.',
  })
  message: string;
}
