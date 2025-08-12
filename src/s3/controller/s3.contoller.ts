import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { S3Service } from '../service/s3.service';

@ApiTags('S3')
@Controller({
  path: 's3',
  version: '1',
})
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('generate-presigned-url')
  @ApiOperation({ summary: 'Generate a presigned URL for S3 upload' })
  @ApiBody({
    description: 'Key and content type for the S3 object',
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string', example: 'uploads/image.jpg' },
        contentType: { type: 'string', example: 'image/jpeg' },
      },
      required: ['key', 'contentType'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the presigned URL for uploading to S3',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://your-bucket.s3.amazonaws.com/uploads/image.jpg',
        },
      },
    },
  })
  generatePresignedUrl(@Body() body: { key: string; contentType: string }) {
    return this.s3Service.generatePresignedUrl(body.key, body.contentType);
  }

  @Post('generate-access-url')
  @ApiOperation({
    summary: 'Generate a presigned access URL for reading a file',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string', example: 'uploads/image.jpg' },
      },
      required: ['key'],
    },
  })
  @ApiResponse({ status: 201, description: 'Presigned access URL returned' })
  generateAccessUrl(@Body() body: { key: string }) {
    return this.s3Service.generateAccessUrl(body.key);
  }

  @Delete('delete-object')
  @ApiOperation({ summary: 'Delete an object from S3' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string', example: 'uploads/image.jpg' },
      },
      required: ['key'],
    },
  })
  @ApiResponse({ status: 201, description: 'Object deleted from S3' })
  deleteObject(@Body() body: { key: string }) {
    return this.s3Service.deleteObject(body.key);
  }
}
