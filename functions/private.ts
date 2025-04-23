import { ListObjectsV2Command, S3Client, _Object } from '@aws-sdk/client-s3';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const s3Client = new S3Client({});
const bucketName = process.env.BUCKET_NAME;

export const handler = async (_event: APIGatewayProxyEventV2) => {
  if (!bucketName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'BUCKET_NAME environment variable is not set' }),
    };
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
    });

    const response = await s3Client.send(command);
    const files =
      response.Contents?.map((object: _Object) => ({
        key: object.Key,
        size: object.Size,
        lastModified: object.LastModified,
      })) || [];

    return {
      statusCode: 200,
      body: JSON.stringify({ files }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to list objects from bucket' }),
    };
  }
};
