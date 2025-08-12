import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_SSO_REGION');
    const identityPoolId = this.configService.get<string>(
      'AWS_IDENTITY_POOL_ID',
    );
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');

    if (!region || !identityPoolId || !bucket) {
      throw new Error('Missing required AWS configuration for Cognito or S3');
    }

    this.s3Client = new S3Client({
      region,
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region }),
        identityPoolId,
        // Optional: For authenticated users, pass login mapping like below
        // logins: {
        //   [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: idToken,
        // },
      }),
    });

    this.bucket = bucket;
  }

  async generatePresignedUrl(
    key: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });
      return signedUrl;
    } catch (error) {
      this.logger.error('Failed to generate presigned URL:', error);
      throw new InternalServerErrorException(
        'Failed to generate presigned URL',
      );
    }
  }

  async generateAccessUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      return signedUrl;
    } catch (error) {
      this.logger.error('Failed to generate access URL:', error);
      throw new InternalServerErrorException('Failed to generate access URL');
    }
  }

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error('Error deleting object from S3:', error);
      throw new InternalServerErrorException('Failed to delete file from S3');
    }
  }
}
