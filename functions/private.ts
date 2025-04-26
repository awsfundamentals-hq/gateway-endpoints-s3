import { ListObjectsV2Command, S3Client, _Object } from '@aws-sdk/client-s3';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const s3Client = new S3Client({
  region: 'us-east-1',
});

const bucketName = process.env.BUCKET_NAME;

export const handler = async (_event: APIGatewayProxyEventV2) => {
  console.info('Starting private function execution');
  console.info('Bucket name:', bucketName);

  if (!bucketName) {
    console.error('BUCKET_NAME environment variable is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'BUCKET_NAME environment variable is not set' }),
    };
  }

  try {
    console.info('Creating ListObjectsV2Command');
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
    });

    console.info('Sending command to S3');
    const response = await s3Client.send(command);
    console.info('Received response from S3');

    const files =
      response.Contents?.map((object: _Object) => ({
        key: object.Key,
        size: object.Size,
        lastModified: object.LastModified,
      })) || [];

    console.info('Returning response with files:', files);

    return {
      statusCode: 200,
      body: JSON.stringify({ files }),
    };
  } catch (error) {
    console.error('Error in private function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to list objects from bucket' }),
    };
  }
};
