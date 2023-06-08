import { Context, APIGatewayEvent } from 'aws-lambda';

export default function handler(lambda: Function) {
  return async function (event: APIGatewayEvent, context: Context) {
    let body, statusCode;

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (error) {
      statusCode = 500;

      if (error instanceof Error) {
        body = { error: error.message };
      } else {
        body = { error: String(error) };
      }
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
    };
  };
}
