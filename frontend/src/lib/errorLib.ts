export function onError(error: any) {
  if (error === "No current user") {
    return;
  }

  let message = String(error);

  if (!(error instanceof Error)
    && error
    && typeof error === 'object'
    && 'message' in error
    && error.message) {
    message = String(error.message);
  }

  alert(message);
}
