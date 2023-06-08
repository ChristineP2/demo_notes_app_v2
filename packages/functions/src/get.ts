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
    // 'Key' defines the partition key and sort key of
    // the item to be retrieved
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      noteId: path_id, // The id of the note from the path
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return result.Item;
});
