import handler from "@notes/core/handler";
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Table } from "sst/node/table";
import * as uuid from "uuid";
import dynamoDb from "@notes/core/dynamodb";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  let data = {
    content: '',
    attachment: ''
  }
  let path_id

  if (!event.pathParameters || !event.pathParameters.id || event.pathParameters.id.length == 0) {
    throw new Error("Please provide the 'id' parameter.");
  } else {
    path_id = event.pathParameters.id
  }

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Table.Notes.tableName,
    Key: {
      // The attributes of the item to be created
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      noteId: path_id, // The id of the note from the path
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":content": data.content || null,
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.update(params);

  return { status: true };
});
