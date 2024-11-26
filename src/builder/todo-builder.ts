export function buildSuccessResponse(statusCode: number, message: string) {
  let response = {
    data: {
      type: "response",
      attributes: {
        message: message
      }
    }
  };
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      "Content-Type": "application/vnd.api+json"
    }
  };
}

export function buildErrorResponse(statusCode: number, message: string) {
  let response = {
    data: {
      type: "error",
      attributes: {
        message: message
      }
    }
  };
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      "Content-Type": "application/vnd.api+json"
    }
  };
}

export function buildUserResponse(statusCode: number, message: string, tasks) {
  let response = {
    data: {
      type: "tasks",
      attributes: {
        message: message,
        tasks: tasks
      }
    }
  };
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      "Content-Type": "application/vnd.api+json"
    }
  };
}

export function buildAuthenticateResponse(statusCode: number, message: string, payload) {
  let response = {
    data: {
      type: "token",
      attributes: {
        access_token: payload["token"],
        token_type: payload["token_type"],
        expires_in: payload["expires_in"],
        scope: payload["scope"],
        jti: payload["jti"]
      }
    }
  };
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      "Content-Type": "application/vnd.api+json"
    }
  };
}