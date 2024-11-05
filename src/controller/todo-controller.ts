import { buildAuthenticateResponse,buildErrorResponse,buildSuccessResponse, buildUserResponse } from "../builder/todo-builder";
import { v4 as uuidv4 } from 'uuid';
import { TodoRepository } from "../repository/todo-repository";
import { CreateUserService } from "../service/createUser-service";
import { GetUserTasksService } from "../service/getUserTasks-service";
import { Taskdetails, TodoDetails } from "../model/todo-model";
import { UpdateTaskService } from "../service/updateTask-service";
import { DeleteTaskService } from "../service/deleteTask-service";
import { ValidationService } from "../service/validation-service";
import { LoginUserService } from "../service/loginUser-service";
import { createJWT, verifyJWT } from "../service/token-service";
import bcrypt from 'bcryptjs';

const createUserService = new CreateUserService(new TodoRepository());
const getUserTasksService = new GetUserTasksService(new TodoRepository());
const updateTaskService = new UpdateTaskService(new TodoRepository());
const deleteTaskService = new DeleteTaskService(new TodoRepository());
const loginUserService = new LoginUserService(new TodoRepository());
const validationService = new ValidationService(loginUserService);

// const event = {
    // "headers": {
    //     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ5OWY3czMiLCJpYXQiOjE3MzA3OTIxODEsImV4cCI6MTczMDc5NTc4MX0.tIvriipBWDeGjH7yKvZBfOvyvHquZjfnzwgxlfArK-I"
    // },
    // httpMethod:"GET",
    // resource: "/getUsers/{userId}",
    // pathParameters: { userId: "y9f7s3" },
    // body:"{\"taskId\":\"0989b3c0-0e38-4ff2-b8c3-03834542363b\"}"
    // body: "{\"taskId\":\"ab7b865e-5943-429c-8851-fda05dde65d7\",\"taskName\":\"coding\",\"status\":\"Complete\"}"
    // body: "{\"userId\":\"y9f7s3\",\"password\":\"Niharika@13\"}"
    // body:"{\"userName\":\"Venkatram\",\"userId\":\"r3i8t6\",\"password\":\"Mahitha@18\",\"taskName\":\"Give Assessment\",\"status\":\"Incomplete\"}"

// }

export const createUserHandler = async (event) => {
    const requestBody = JSON.parse(event.body);

    try {
        validationService.validateUserName(requestBody.userName);
        validationService.validateUserId(requestBody.userId);
        validationService.validatePassword(requestBody.password);
        validationService.validateTaskName(requestBody.taskName);
        validationService.validateStatus(requestBody.status);

        const userName = requestBody.userName;
        const userId = requestBody.userId;
        const plainPassword = requestBody.password;
        const taskId = uuidv4();
        const taskName = requestBody.taskName;
        const status = requestBody.status;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        const task: Taskdetails = {
            taskId: taskId,
            taskName: taskName,
            status: status
        };

        const todoDetails: TodoDetails = {
            userId: userId,
            userName: userName,
            password: hashedPassword,
            tasks: [task]
        };

        await createUserService.createUser(todoDetails);
        let response = buildSuccessResponse(201, 'User added successfully');
        console.log(response);
        return response;

    } catch (error) {
        console.log(error);
        console.log(error);
        if (error instanceof Error) {
            let errorResponse = buildErrorResponse(400, 'Not able to add user');
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
    if (!authHeaders) {
        return buildErrorResponse(400, "Authorization header not found");
    } else if (!userId) {
        return buildErrorResponse(400, "No parameters");
    } else {
        try {
            const token = authHeaders.split(' ')[1];
            if (!token) {
                console.log("No Token");
                return buildErrorResponse(400, "Authorization token is required");
            }
            await verifyJWT(token);
            const tasks = await getUserTasksService.getUserTasks(userId);
            let userTasks = buildUserResponse(200, 'Retrived all tasks of user', JSON.stringify(tasks));
            console.log(userTasks);
            return userTasks;

        } catch (error) {
            if (error.message === "Token verification failed") {
                let tokenResponse = buildErrorResponse(401, "Token verification failed");
                console.log(tokenResponse);
                return tokenResponse;
            } else if (error.message === "Unauthorized user") {
                let tokenResponse = buildErrorResponse(401, "Unauthorized user");
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
    let userId = event.pathParameters.userId;
    const authHeaders = event.headers['Authorization'];
    const requestBody = JSON.parse(event.body);
    if (!authHeaders) {
        console.log("No Auth");
        return buildErrorResponse(400, "Authorization header not found");
    } else if (!userId) {
        return buildErrorResponse(400, "No user id found");
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

            const taskId = requestBody.taskId;
            const taskName = requestBody.taskName;
            const status = requestBody.status;

            await updateTaskService.updateTask(userId, taskId, taskName, status);
            let updatedResponse= buildSuccessResponse(200, 'Task updated successfully');
            console.log(updatedResponse);
            return updatedResponse;
        } catch (error) {
            console.log(error);
            if (error.message === "Token verification failed") {
                let tokenResponse = buildErrorResponse(401, "Token verification failed");
                console.log(tokenResponse);
                return tokenResponse;
            } else if (error.message === "Unauthorized user") {
                let tokenResponse = buildErrorResponse(401, "Unauthorized user");
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
    let userId = event.pathParameters.userId;
    const authHeaders = event.headers['Authorization'];
    const requestBody = JSON.parse(event.body);
    if (!authHeaders) {
        console.log("No Auth");
        return buildErrorResponse(400, "Authorization header not found");
    } else if (!userId) {
        return buildErrorResponse(400, "No user id found");
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

            const taskId = requestBody.taskId;
            await deleteTaskService.deleteTask(userId,taskId);
            let deleteResponse= buildSuccessResponse(204, 'Task deleted successfully');
            console.log(deleteResponse)
            return deleteResponse;
        } catch (error) {
            console.log(error);
            if (error.message === "Token verification failed") {
                let tokenResponse = buildErrorResponse(401, "Token verification failed");
                console.log(tokenResponse);
                return tokenResponse;
            } else if (error.message === "Unauthorized user") {
                let tokenResponse = buildErrorResponse(401, "Unauthorized user");
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
