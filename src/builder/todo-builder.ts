export function buildSuccessResponse(statusCode: number, message: string) {
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