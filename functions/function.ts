import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEventV2) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello, world!' }),
  };
};
