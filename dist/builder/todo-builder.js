"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSuccessResponse = buildSuccessResponse;
function buildSuccessResponse(statusCode, message) {
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