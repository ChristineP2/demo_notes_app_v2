import { Context, APIGatewayEvent } from 'aws-lambda';
import * as debug from "./debug";

export default function handler(lambda: Function) {
  return async function (event: APIGatewayEvent, context: Context) {
    let body, statusCode;

    // Start debugger
    debug.init(event);

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (error) {
      // Print debug messages
      debug.flush(error);

      if (error instanceof Error) {
        body = {error: error.message};
      } else {
        body = {error: String(error)};
      }
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
}
