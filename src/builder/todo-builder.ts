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
export function buildAuthenticateResponse(statusCode: number, message: string,payload){
    let token={
        "access_token": payload["token"],
        "token_type": payload["token_type"],
        "expires_in": payload["expires_in"],
        "scope": payload["scope"],
        "jti": payload["jti"]
    }
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