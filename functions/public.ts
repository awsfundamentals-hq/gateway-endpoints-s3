import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const functionName = process.env.FUNCTION_NAME;
const lambdaClient = new LambdaClient({
  region: 'us-east-1',
  endpoint: 'https://lambda.us-east-1.amazonaws.com',
});

export const handler = async (_event: APIGatewayProxyEventV2) => {
  console.info('Starting public function execution');
  console.info('Function name:', functionName);

  try {
    console.info('Creating InvokeCommand');
    const command = new InvokeCommand({
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
    });

    console.info('Sending command to Lambda');
    const response = await lambdaClient.send(command);
    console.info('Received response from Lambda');

    const payload = JSON.parse(Buffer.from(response.Payload!).toString());
    console.info('Parsed payload:', payload);

    return {
      statusCode: 200,
      body: JSON.stringify(payload),
    };
  } catch (error) {
    console.error('Error in public function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to invoke function' }),
    };
  }
};
