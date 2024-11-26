"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSuccessResponse = buildSuccessResponse;
exports.buildErrorResponse = buildErrorResponse;
exports.buildUserResponse = buildUserResponse;
exports.buildAuthenticateResponse = buildAuthenticateResponse;
function buildSuccessResponse(statusCode, message) {
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
function buildErrorResponse(statusCode, message) {
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
function buildUserResponse(statusCode, message, tasks) {
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
function buildAuthenticateResponse(statusCode, message, payload) {
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
//# sourceMappingURL=todo-builder.js.map