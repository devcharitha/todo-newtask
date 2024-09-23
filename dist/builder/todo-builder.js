"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResponse = buildResponse;
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
//# sourceMappingURL=todo-builder.js.map