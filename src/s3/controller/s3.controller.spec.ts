import { Test, TestingModule } from '@nestjs/testing';

import { S3Service } from '../service/s3.service';
import { S3Controller } from './s3.contoller';

describe('UploadS3Controller', () => {
  let controller: S3Controller;

  const mockS3Service = {
    generatePresignedUrl: jest.fn(),
    generateAccessUrl: jest.fn(),
    deleteObject: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3Controller],
      providers: [
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    controller = module.get<S3Controller>(S3Controller);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePresignedUrl', () => {
    it('should return a presigned upload URL', async () => {
      const mockBody = {
        key: 'uploads/test.jpg',
        contentType: 'image/jpeg',
      };

      const mockUrl = {
        url: 'https://mock-s3-url.com/uploads/test.jpg',
      };

      mockS3Service.generatePresignedUrl.mockResolvedValue(mockUrl);

      const result = await controller.generatePresignedUrl(mockBody);
      expect(mockS3Service.generatePresignedUrl).toHaveBeenCalledWith(
        mockBody.key,
        mockBody.contentType,
      );
      expect(result).toEqual(mockUrl);
    });
  });

  describe('generateAccessUrl', () => {
    it('should return a presigned access URL', async () => {
      const mockBody = { key: 'uploads/test.jpg' };
      const mockAccessUrl = {
        url: 'https://mock-s3-url.com/uploads/test.jpg',
      };

      mockS3Service.generateAccessUrl.mockResolvedValue(mockAccessUrl);

      const result = await controller.generateAccessUrl(mockBody);
      expect(mockS3Service.generateAccessUrl).toHaveBeenCalledWith(
        mockBody.key,
      );
      expect(result).toEqual(mockAccessUrl);
    });
  });

  describe('deleteObject', () => {
    it('should delete an object from S3 and return confirmation', async () => {
      const mockBody = { key: 'uploads/test.jpg' };
      const mockResponse = { success: true };

      mockS3Service.deleteObject.mockResolvedValue(mockResponse);

      const result = await controller.deleteObject(mockBody);
      expect(mockS3Service.deleteObject).toHaveBeenCalledWith(mockBody.key);
      expect(result).toEqual(mockResponse);
    });
  });
});
