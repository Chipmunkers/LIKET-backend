import { S3ClientConfig } from '@aws-sdk/client-s3';

/**
 * @author jochongs
 */
export default (): { s3: S3ClientConfig } => ({
  s3: {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  },
});
