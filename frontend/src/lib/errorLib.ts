import * as Sentry from "@sentry/react";
import config from "../config";

export interface ErrorInfoLocalType {
  [key: string | symbol]: string;
}

const isLocal = process.env.NODE_ENV === "development";

export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({ dsn: config.SENTRY_DSN });
}

export function logError(error: unknown, errorInfo: ErrorInfoLocalType | null = null) {
  if (isLocal) {
    return;
  }

  Sentry.withScope((scope) => {
    errorInfo && scope.setExtras({extra: String(errorInfo)});
    Sentry.captureException(error);
  });
}
export function onError(error: unknown) {
  if (error === "No current user") {
    // discard auth errors from non-logged-in user
    return;
  }

  let errorInfo = {} as ErrorInfoLocalType
  let message = String(error);
  // typesafe version of our unknown error, always going to
  // become an object for logging.
  let err = {}

  if (error instanceof Error) {
    // It is an error, we can go forth and report it.
    err = error;
  } else {
    if (!(error instanceof Error)
      && typeof error === 'object'
      && error !== null) {
      //  At least it's an object, let's use it.
      err = error;
      // Let's cast it as an ErrorInfoType so we can check
      // a couple more things.
      errorInfo = error as ErrorInfoLocalType;

      // If it has a message, assume auth error from Amplify Auth
      if ('message' in errorInfo
        && typeof errorInfo.message === 'string') {
        message = errorInfo.message;
        error = new Error(message);
      }

      // Found Config, Assume API error from Amplify Axios
      if ('config' in errorInfo
        && errorInfo !== null
        && typeof errorInfo.config === 'object'
        && errorInfo.config !== null
        && 'url' in errorInfo.config
      ) {
        errorInfo.url = errorInfo.config['url'];
      }
    }

    // If nothing else, make a new error using message from
    // the start of all this.
    if (typeof error !== 'object') {
      err = new Error(message);
    }
  }

  logError(err, errorInfo);

  alert(message);
}
