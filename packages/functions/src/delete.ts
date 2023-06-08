import handler from "@notes/core/handler";
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Table } from "sst/node/table";
import dynamoDb from "@notes/core/dynamodb";

export const main = handler(async (event: APIGatewayProxyEvent) => {

  let path_id
  if (!event.pathParameters || !event.pathParameters.id || event.pathParameters.id.length == 0) {
    throw new Error("Please provide the 'id' parameter.");
  } else {
    path_id = event.pathParameters.id
  }

  const params = {
    TableName: Table.Notes.tableName,
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      noteId: path_id, // The id of the note from the path
    },
  };

  await dynamoDb.delete(params);

  return { status: true };
});
