import util from "util";
import AWS from "aws-sdk";
import {APIGatewayEvent} from "aws-lambda";

export interface LogType {
  [key: string | symbol]: Date | string;
}

let logs:Array<LogType>;

// Log AWS SDK calls
AWS.config.logger = { log: debug };

export default function debug(...args: Array<any>) {
  logs.push({
    date: new Date(),
    string: util.format.apply(null, [...args]),
  });
}

export function init(event: APIGatewayEvent) {
  logs = [];

  // Log API event
  debug("API event", {
    body: event.body,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
  });
}

export function flush(error: unknown) {
  logs.forEach(({ date, string }) => console.debug(date, string));
  console.error(error);
}
