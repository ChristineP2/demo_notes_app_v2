import * as iam from "aws-cdk-lib/aws-iam";
import {Cognito, StackContext, use} from "sst/constructs";
import {StorageStack} from "./StorageStack";
import {ApiStack} from "./ApiStack";

export function AuthStack({ stack, app }: StackContext) {
  const { bucket } = use(StorageStack);
  const { api } = use(ApiStack);

  // Create a Cognito User Pool and Identity Pool
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  auth.attachPermissionsForAuthUsers(stack, [
    // Allow access to the API
    api,
    // Policy granting access to a specific folder in the bucket
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  // Show the auth resources in the output
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
    apigTestFlags: `
       --user-pool-id='${auth.userPoolId}' \\
       --app-client-id='${auth.userPoolClientId}' \\
       --cognito-region='${app.region}' \\
       --identity-pool-id='${auth.cognitoIdentityPoolId}' \\
       --invoke-url='${api.url}' \\
       --api-gateway-region='${app.region}' \\
    `
  });

  // Return the auth resource
  return {
    auth,
  };
}
