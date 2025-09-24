import { Controller, Get, Redirect } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiExtraModels,
  ApiProperty,
} from '@nestjs/swagger';

class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: 'ok';

  @ApiProperty({ example: 12345, description: 'Process uptime in seconds' })
  uptime: number;

  @ApiProperty({ example: '2025-09-22T01:23:45.000Z' })
  timestamp: string;

  @ApiProperty({ example: '0.0.1', nullable: true })
  version?: string;

  @ApiProperty({ example: 'a1b2c3d', nullable: true })
  commit?: string | null;
}

@ApiTags('system')
@ApiExtraModels(HealthResponseDto)
@Controller()
export class AppController {
  // Redirect root to Swagger UI
  @Get()
  @ApiOperation({ summary: 'Root', description: 'Redirects to Swagger UI' })
  @ApiResponse({
    status: 302,
    description: 'Found. Redirect to /docs',
    headers: {
      Location: {
        description: 'Swagger UI',
        schema: { type: 'string', example: '/docs' },
      },
    },
  })
  @Redirect('/docs', 302)
  root() {}

  // Simple health check for load balancers/uptime monitors
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ description: 'Service is healthy', type: HealthResponseDto })
  health(): HealthResponseDto {
    return {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      commit: process.env.GIT_COMMIT ?? null,
    };
  }
}
