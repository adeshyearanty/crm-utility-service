import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));
jest.mock('@aws-sdk/client-cognito-identity');
jest.mock('@aws-sdk/credential-provider-cognito-identity', () => ({
  fromCognitoIdentityPool: jest.fn().mockReturnValue({}),
}));

describe('S3Service', () => {
  let service: S3Service;
  let configService: ConfigService;

  const mockRegion = 'us-east-1';
  const mockBucket = 'test-bucket';
  const mockIdentityPoolId = 'us-east-1:mock-id';

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'AWS_SSO_REGION':
            return mockRegion;
          case 'AWS_IDENTITY_POOL_ID':
            return mockIdentityPoolId;
          case 'AWS_S3_BUCKET':
            return mockBucket;
          default:
            return null;
        }
      }),
    } as unknown as ConfigService;

    service = new S3Service(configService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePresignedUrl', () => {
    it('should return a presigned upload URL', async () => {
      const mockUrl = 'https://mock-s3-upload-url';
      (getSignedUrl as jest.Mock).mockResolvedValue(mockUrl);

      const key = 'uploads/image.jpg';
      const contentType = 'image/jpeg';

      const result = await service.generatePresignedUrl(key, contentType);

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(PutObjectCommand),
        expect.objectContaining({ expiresIn: 3600 }),
      );

      expect(result).toBe(mockUrl);
    });

    it('should throw error if presigned URL generation fails', async () => {
      (getSignedUrl as jest.Mock).mockRejectedValue(new Error('AWS error'));

      await expect(service.generatePresignedUrl('key', 'type')).rejects.toThrow(
        'Failed to generate presigned URL',
      );
    });
  });

  describe('generateAccessUrl', () => {
    it('should return a presigned access URL', async () => {
      const mockUrl = 'https://mock-s3-access-url';
      (getSignedUrl as jest.Mock).mockResolvedValue(mockUrl);

      const key = 'uploads/image.jpg';

      const result = await service.generateAccessUrl(key);

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(GetObjectCommand),
        expect.objectContaining({ expiresIn: 3600 }),
      );

      expect(result).toBe(mockUrl);
    });

    it('should throw error if access URL generation fails', async () => {
      (getSignedUrl as jest.Mock).mockRejectedValue(new Error('AWS error'));

      await expect(service.generateAccessUrl('key')).rejects.toThrow(
        'Failed to generate access URL',
      );
    });
  });

  describe('deleteObject', () => {
    it('should send a delete command to S3', async () => {
      const mockSend = jest.fn().mockResolvedValue({});
      service['s3Client'].send = mockSend;

      await service.deleteObject('uploads/test.jpg');

      expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
    });

    it('should throw error if delete fails', async () => {
      const mockSend = jest.fn().mockRejectedValue(new Error('Delete error'));
      service['s3Client'].send = mockSend;

      await expect(service.deleteObject('key')).rejects.toThrow(
        'Failed to delete file from S3',
      );
    });
  });
});
