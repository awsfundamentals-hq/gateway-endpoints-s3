import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const functionName = process.env.FUNCTION_NAME;
const lambdaClient = new LambdaClient({ region: 'us-east-1' });

export const handler = async (_event: APIGatewayProxyEventV2) => {
  try {
    const command = new InvokeCommand({
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
    });

    const response = await lambdaClient.send(command);
    const payload = JSON.parse(Buffer.from(response.Payload!).toString());

    return {
      statusCode: 200,
      body: JSON.stringify(payload),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to invoke function' }),
    };
  }
};
