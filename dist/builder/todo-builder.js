"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResponse = buildResponse;
exports.buildAuthenticateResponse = buildAuthenticateResponse;
function buildResponse(statusCode, message, tasks) {
    return {
        statusCode: statusCode,
        body: {
            jsonapi: {
                version: "1.0",
                message
            },
        },
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
        statusCode: statusCode,
        body: {
            jsonapi: {
                version: "1.0",
                message,
                token
            },
        },
    };
}
//# sourceMappingURL=todo-builder.js.map