export function buildResponse(statusCode: number, message: string) {
    return {
        "jsonapi": {
          "version": "1.0"
        },
        "data":{
            "attributes": 
              {
                statusCode,
                message
              },
        }
      };
}

export function buildUserResponse(statusCode: number,message: string,tasks:any) {
    return {
        "jsonapi": {
          "version": "1.0"
        },
        "data":{
            "attributes": 
              {
                statusCode,
                message,
                tasks
              },
        }
      };
}
export function buildAuthenticateResponse(statusCode: number, message: string,payload){
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