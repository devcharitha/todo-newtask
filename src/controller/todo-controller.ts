import { buildAuthenticateResponse, buildErrorResponse, buildSuccessResponse, buildUserResponse } from "../builder/todo-builder";
import { v4 as uuidv4 } from 'uuid';
import { TodoRepository } from "../repository/todo-repository";
import { CreateUserService } from "../service/createUser-service";
import { CreateTaskService } from "../service/createTask-service";
import { GetUserTasksService } from "../service/getUserTasks-service";
import { TaskDetails, TodoUserDetails } from "../model/todo-model";
import { UpdateTaskService } from "../service/updateTask-service";
import { DeleteTaskService } from "../service/deleteTask-service";
import { ValidationService } from "../service/validation-service";
import { LoginUserService } from "../service/loginUser-service";
import { createJWT, verifyJWT } from "../service/token-service";
import bcrypt from 'bcryptjs';

const createUserService = new CreateUserService(new TodoRepository());
const createTaskService = new CreateTaskService(new TodoRepository())
const getUserTasksService = new GetUserTasksService(new TodoRepository());
const updateTaskService = new UpdateTaskService(new TodoRepository());
const deleteTaskService = new DeleteTaskService(new TodoRepository());
const loginUserService = new LoginUserService(new TodoRepository());
const validationService = new ValidationService(loginUserService);

const event = {
    // "headers": {
    // "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhamFsMTIzIiwiaWF0IjoxNzMyNjI0ODEyLCJleHAiOjE3MzI2Mjg0MTJ9.09XY-PcRfXWU6wJEoz7zPt9OxpoOR1Pyp26xnbhVFm8"
    // },
    // httpMethod:"GET",
    // resource: "/getUserTasks/{userId}",
    // pathParameters: { userId: "ajal123" }
    // body:"{\"taskId\":\"0989b3c0-0e38-4ff2-b8c3-03834542363b\"}"
    // body: "{\"userId\":\"p5k7j6\",\"taskName\":\"Interview\",\"status\":\"Incomplete\"}"
    // body: "{\"userId\":\"k8l8t6\",\"password\":\"Charitha@18\"}"
    // body:"{\"userName\":\"Charithad\",\"userId\":\"k8l8t6\",\"password\":\"Charitha@18\",\"taskName\":\"Give Assessment\",\"status\":\"Incomplete\"}"

}

export const createUserHandler = async (event) => {
    const requestBody = JSON.parse(event.body);

    try {
        validationService.validateUserName(requestBody.userName);
        validationService.validateUserId(requestBody.userId);
        validationService.validatePassword(requestBody.password);

        const userName = requestBody.userName;
        const userId = requestBody.userId;
        const plainPassword = requestBody.password;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        const TodoDetails: TodoUserDetails = {
            userId: userId,
            userName: userName,
            password: hashedPassword,
        };

        await createUserService.createUser(TodoDetails);
        let response = buildSuccessResponse(201, 'User added successfully');
        console.log(response);
        return response;

    } catch (error) {
        console.log(error);
        if (error.message === "Invalid UserName format" || error.message === "Invalid UserId format" || error.message === "Invalid Password format" || error.message === "Invalid TaskName format" || error.message === "Invalid status content") {
            let errorResponse = buildErrorResponse(400, error.message);
            console.log(errorResponse);
            return errorResponse;
        } else {
            let errorResponse = buildErrorResponse(500, 'Internal Server Error');
            console.log(errorResponse);
            return errorResponse;
        }
    }
};
// createUserHandler(event);

export const createTaskHandler = async (event) => {
    const authHeaders = event.headers['Authorization'];
    const requestBody = JSON.parse(event.body);
    const userId=requestBody.userId;
    if (!userId) {
        return buildErrorResponse(400, "userId not found");
    } else if (!authHeaders) {
        return buildErrorResponse(400, "Authorization header not found");
    } else if (!requestBody) {
        return buildErrorResponse(400, "No request body found");
    }

    try {
        const token = authHeaders.split(' ')[1];
        if (!token) {
            console.log("No Token");
            return buildErrorResponse(400, "Authorization token is required");
        }
        await verifyJWT(token);

        validationService.validateTaskName(requestBody.taskName);
        validationService.validateStatus(requestBody.status);

        const taskDetails : TaskDetails= {
            taskId: uuidv4(),
            taskName: requestBody.taskName,
            status: requestBody.status
        };

        await createTaskService.createTask(userId, taskDetails);
        let response = buildSuccessResponse(201, 'Task added successfully');
        console.log(response);
        return response;

    } catch (error) {
        if (error.message === "Invalid UserId format" || error.message === "Invalid TaskName format" || error.message === "Invalid status content") {
            let userIdResponse = buildErrorResponse(400, error.message);
            console.log(userIdResponse);
            return userIdResponse;
        } else if (error.message === "Invalid token" || error.message === "Unauthorized") {
            let tokenResponse = buildErrorResponse(401, error.message);
            console.log(tokenResponse);
            return tokenResponse;
        } else {
            let tokenResponse = buildErrorResponse(500, "Internal Server error");
            console.log(tokenResponse);
            return tokenResponse;
        }
    }
};
// createTaskHandler(event);

export const loginUserHandler = async (event) => {
    const requestBody = JSON.parse(event.body);
    try {
        validationService.validateUserId(requestBody.userId);
        validationService.validatePassword(requestBody.password);

        const userId: string = await validationService.validateUser(requestBody);

        const tokenResponse = createJWT(userId);

        let response = buildAuthenticateResponse(200, 'Generated code successfully', tokenResponse);
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        if (error.message === "Invalid UserId format" || error.message === "Invalid Password format") {
            let errorMessage = buildErrorResponse(400, error.message);
            console.log(errorMessage);
            return errorMessage;
        } else if (error.message === "Unauthorized") {
            let err = buildErrorResponse(401, error.message);
            console.log(err);
            return err;
        } else {
            let error = buildErrorResponse(500, 'Internal server error');
            console.log(error);
            return error;
        }
    }
}
// loginUserHandler(event);

export const getUserTasksHandler = async (event) => {
    let userId = event.pathParameters.userId;
    const authHeaders = event.headers['Authorization'];

    if (!userId) {
        return buildErrorResponse(400, "userId not found");
    } else if (!authHeaders) {
        return buildErrorResponse(400, "Authorization header not found");
    } else {
        try {
            validationService.validateUserId(userId);
            const token = authHeaders.split(' ')[1];
            if (!token) {
                console.log("No Token");
                return buildErrorResponse(400, "Authorization token is required");
            }
            await verifyJWT(token);
            const tasks = await getUserTasksService.getUserTasks(userId);

            if (!tasks) {
                return buildErrorResponse(404, "userId not found");
            }

            let userTasks = buildUserResponse(200, 'Retrieved all tasks of user',tasks);
            console.log(userTasks);
            return userTasks;
        } catch (error) {
            if (error.message === "Invalid UserId format") {
                let userIdResponse = buildErrorResponse(400, error.message);
                console.log(userIdResponse);
                return userIdResponse;
            } else if (error.message === "Invalid token" || error.message === "Unauthorized") {
                let tokenResponse = buildErrorResponse(401, error.message);
                console.log(tokenResponse);
                return tokenResponse;
            } else {
                let tokenResponse = buildErrorResponse(500, "Internal Server error");
                console.log(tokenResponse);
                return tokenResponse;
            }
        }
    }
};
// getUserTasksHandler(event);

export const updateTaskHandler = async (event) => {
    const userId = event.queryStringParameters.userId;
    const taskId = event.queryStringParameters.taskId;
    const authHeaders = event.headers['Authorization'];
    const requestBody = JSON.parse(event.body);
    if (!userId) {
        return buildErrorResponse(400, "UserId not found");
    }
    else if (!taskId) {
        return buildErrorResponse(400, "UserId not found");
    } else if (!authHeaders) {
        return buildErrorResponse(400, "Authorization header not found");
    } else if (!requestBody) {
        return buildErrorResponse(400, "No request body found");
    } else {
        try {
            const token = authHeaders.split(' ')[1];
            if (!token) {
                console.log("No Token");
                return buildErrorResponse(400, "Authorization token is required");
            }
            await verifyJWT(token);

            const status = requestBody.status;

            await updateTaskService.updateTask(userId, taskId, status);
            let updatedResponse = buildSuccessResponse(200, 'Task updated successfully');
            console.log(updatedResponse);
            return updatedResponse;
        } catch (error) {
            console.log(error);
            if (error.message === "Invalid UserId format") {
                let userIdResponse = buildErrorResponse(400, error.message);
                console.log(userIdResponse);
                return userIdResponse;
            } else if (error.message === "Invalid token" || error.message === "Unauthorized") {
                let tokenResponse = buildErrorResponse(401, error.message);
                console.log(tokenResponse);
                return tokenResponse;
            } else {
                let tokenResponse = buildErrorResponse(500, "Internal Server error");
                console.log(tokenResponse);
                return tokenResponse;
            }
        }
    }
};
// updateTaskHandler(event);

export const deleteTaskHandler = async (event) => {
    const userId = event.queryStringParameters.userId;
    const taskId = event.queryStringParameters.taskId;
    const authHeaders = event.headers['Authorization'];

    if (!userId) {
        return buildErrorResponse(400, "UserId not found");
    } else if (!taskId) {
        return buildErrorResponse(400, "TaskId not found");
    } else if (!authHeaders) {
        return buildErrorResponse(400, "Authorization header not found");
    } else {
        try {
            const token = authHeaders.split(' ')[1];
            if (!token) {
                console.log("No Token");
                return buildErrorResponse(400, "Authorization token is required");
            }
            await verifyJWT(token);

            await deleteTaskService.deleteTask(userId, taskId);
            let deleteResponse = buildSuccessResponse(204, 'Task deleted successfully');
            console.log(deleteResponse)
            return deleteResponse;
        } catch (error) {
            console.log(error);
            if (error.message === "Invalid UserId format") {
                let userIdResponse = buildErrorResponse(400, error.message);
                console.log(userIdResponse);
                return userIdResponse;
            } else if (error.message === "Invalid token" || error.message === "Unauthorized") {
                let tokenResponse = buildErrorResponse(401, error.message);
                console.log(tokenResponse);
                return tokenResponse;
            } else {
                let tokenResponse = buildErrorResponse(500, "Internal Server error");
                console.log(tokenResponse);
                return tokenResponse;
            }
        }
    }
};
// deleteTaskHandler(event);
