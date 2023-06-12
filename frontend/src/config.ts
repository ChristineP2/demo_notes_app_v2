const config = {
  // Frontend config
  STRIPE_KEY: "pk_test_51NC963IkmQPuh7HllUIFRVxzwG60eD19GnW9l8PibOTskz8aFiiZYfn8HT7qQi5MjxQPNahZSMKW9CXj2eN3yejd00uGobTDm1",
  MAX_ATTACHMENT_SIZE: 5000000,
  SENTRY_DSN: "https://91153c739ab7409b8c84e12e14ce60c8@o4505309504208896.ingest.sentry.io/4505309540515840",
  // Backend config
  s3: {
    REGION: process.env.REACT_APP_REGION,
    BUCKET: process.env.REACT_APP_BUCKET,
  },
  apiGateway: {
    REGION: process.env.REACT_APP_REGION,
    URL: process.env.REACT_APP_API_URL,
  },
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
};

export default config;
