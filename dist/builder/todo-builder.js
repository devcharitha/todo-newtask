"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSuccessResponse = buildSuccessResponse;
exports.buildErrorResponse = buildErrorResponse;
exports.buildUserResponse = buildUserResponse;
exports.buildAuthenticateResponse = buildAuthenticateResponse;
function buildSuccessResponse(statusCode, message) {
    let response = {
        "success": {
            message
        },
    };
    return {
        statusCode,
        body: JSON.stringify(response)
    };
}
function buildErrorResponse(statusCode, message) {
    let response = {
        "error": {
            message
        },
    };
    return {
        statusCode,
        body: JSON.stringify(response)
    };
}
function buildUserResponse(statusCode, message, tasks) {
    let response = {
        tasks
    };
    return {
        statusCode,
        body: JSON.stringify(response)
    };
}
function buildAuthenticateResponse(statusCode, message, payload) {
    let token = {
        "access_token": payload["token"],
        "token_type": payload["token_type"],
        "expires_in": payload["expires_in"],
        "scope": payload["scope"],
        "jti": payload["jti"]
    };
    return {
        statusCode,
        body: JSON.stringify(token),
    };
}
//# sourceMappingURL=todo-builder.js.map