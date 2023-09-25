import * as AWS from 'aws-sdk';
import { AppConfig } from './config';

const CONFIG = AppConfig();

// Set your AWS credentials and region
AWS.config.update({
  accessKeyId: CONFIG.S3_KEY,
  secretAccessKey: CONFIG.S3_SECRET,
  region: CONFIG.S3_REGION,
});

// Create an S3 instance
const s3 = new AWS.S3();

export default s3;
