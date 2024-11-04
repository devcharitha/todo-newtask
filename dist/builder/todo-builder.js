"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResponse = buildResponse;
exports.buildUserResponse = buildUserResponse;
exports.buildAuthenticateResponse = buildAuthenticateResponse;
function buildResponse(statusCode, message) {
    return {
        "jsonapi": {
            "version": "1.0"
        },
        "data": {
            "attributes": {
                statusCode,
                message
            },
        }
    };
}
function buildUserResponse(statusCode, message, tasks) {
    return {
        "jsonapi": {
            "version": "1.0"
        },
        "data": {
            "attributes": {
                statusCode,
                message,
                tasks
            },
        }
    };
}
function buildAuthenticateResponse(statusCode, message, payload) {
    return {
        "jsonapi": {
            "version": "1.0"
        },
        "data": {
            "type": "token",
            "attributes": {
                statusCode,
                message,
                acces_token: payload.token,
                token_type: payload.token_type,
                expires_in: payload.expires_in,
                scope: payload.scope,
                jti: payload.jti
            },
        },
    };
}
//# sourceMappingURL=todo-builder.js.map