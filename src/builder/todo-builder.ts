export function buildSuccessResponse(statusCode: number, message: string) {
  let response = {
    "success": 
      {
        message
      },
  };
  return{
    statusCode,
    body:JSON.stringify(response)
  }
}
export function buildErrorResponse(statusCode: number, message: string) {
  let response = {
    "error": 
      {
        message
      },
  };
  return{
    statusCode,
    body:JSON.stringify(response)
  }
}
export function buildUserResponse(statusCode: number,message: string,tasks) {
  let response = {
        tasks
  };
  return{
    statusCode,
    body:JSON.stringify(response)
  }
}
export function buildAuthenticateResponse(statusCode: number, message: string,payload){

  let token={
    "access_token": payload["token"],
    "token_type": payload["token_type"],
    "expires_in": payload["expires_in"],
    "scope": payload["scope"],
    "jti": payload["jti"]
}
return{
  statusCode,
  body:JSON.stringify(token),
}
}