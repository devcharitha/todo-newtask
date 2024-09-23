export function buildResponse(statusCode: number, message: string,tasks?:string) {
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