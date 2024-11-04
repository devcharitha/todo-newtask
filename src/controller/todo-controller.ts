import { buildAuthenticateResponse, buildResponse, buildUserResponse } from "../builder/todo-builder";
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
    //     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyM2k4dDYiLCJpYXQiOjE3MzA3MTgyMDQsImV4cCI6MTczMDcyMTgwNH0._bYclfoicOQ0tEbBDDsd2xtrLjxEYI87nSIjQC0XKVg"
    // },
    // httpMethod:"GET",
    // resource: "/delete-task/{userId}",
    // pathParameters: { userId: "r3i8t6" },
    // body:"{\"taskId\":\"ab7b865e-5943-429c-8851-fda05dde65d7\"}"
    // body: "{\"taskId\":\"ab7b865e-5943-429c-8851-fda05dde65d7\",\"taskName\":\"coding\",\"status\":\"Complete\"}"
    // body: "{\"userId\":\"r3i8t6\",\"password\":\"Mahitha@18\"}"
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
        let response = buildResponse(201, 'User added successfully');
        console.log(response);
        return response;

    } catch (error) {
        console.log(error);
        console.log(error);
        if (error instanceof Error) {
            let errorResponse = buildResponse(400, 'Not able to add user');
            console.log(errorResponse);
            return errorResponse;
        } else {
            let errorResponse = buildResponse(500, 'Internal Server Error');
            console.log(errorResponse);
            return errorResponse;
        }
    }
};
createUserHandler(event);

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
            let errorMessage = buildResponse(400, error.message);
            console.log(errorMessage);
            return errorMessage;
        } else if (error.message === "Unauthorized") {
            let err = buildResponse(401, error.message);
            console.log(err);
            return err;
        } else {
            let error = buildResponse(500, 'Internal server error');
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
        return buildResponse(400, "Authorization header not found");
    } else if (!userId) {
        return buildResponse(400, "No parameters");
    } else {
        try {
            const token = authHeaders.split(' ')[1];
            if (!token) {
                console.log("No Token");
                return buildResponse(400, "Authorization token is required");
            }
            await verifyJWT(token);
            const tasks = await getUserTasksService.getUserTasks(userId);
            let userTasks = buildUserResponse(200, 'Retrived all tasks of user', JSON.stringify(tasks));
            console.log(userTasks);
            return userTasks;

        } catch (error) {
            if (error.message === "Token verification failed") {
                let tokenResponse = buildResponse(401, "Token verification failed");
                console.log(tokenResponse);
                return tokenResponse;
            } else if (error.message === "Unauthorized user") {
                let tokenResponse = buildResponse(401, "Unauthorized user");
                console.log(tokenResponse);
                return tokenResponse;
            } else {
                let tokenResponse = buildResponse(500, "Internal Server error");
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
        return buildResponse(400, "Authorization header not found");
    } else if (!userId) {
        return buildResponse(400, "No user id found");
    } else if (!requestBody) {
        return buildResponse(400, "No request body found");
    } else {
        try {
            const token = authHeaders.split(' ')[1];
            if (!token) {
                console.log("No Token");
                return buildResponse(400, "Authorization token is required");
            }
            await verifyJWT(token);

            const taskId = requestBody.taskId;
            const taskName = requestBody.taskName;
            const status = requestBody.status;

            await updateTaskService.updateTask(userId, taskId, taskName, status);
            let updatedResponse= buildResponse(200, 'Task updated successfully');
            console.log(updatedResponse);
            return updatedResponse;
        } catch (error) {
            console.log(error);
            if (error.message === "Token verification failed") {
                let tokenResponse = buildResponse(401, "Token verification failed");
                console.log(tokenResponse);
                return tokenResponse;
            } else if (error.message === "Unauthorized user") {
                let tokenResponse = buildResponse(401, "Unauthorized user");
                console.log(tokenResponse);
                return tokenResponse;
            } else {
                let tokenResponse = buildResponse(500, "Internal Server error");
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
        return buildResponse(400, "Authorization header not found");
    } else if (!userId) {
        return buildResponse(400, "No user id found");
    } else if (!requestBody) {
        return buildResponse(400, "No request body found");
    } else {
        try {
            const token = authHeaders.split(' ')[1];
            if (!token) {
                console.log("No Token");
                return buildResponse(400, "Authorization token is required");
            }
            await verifyJWT(token);

            const taskId = requestBody.taskId;
            await deleteTaskService.deleteTask(userId,taskId);
            let deleteResponse= buildResponse(204, 'Task deleted successfully');
            console.log(deleteResponse)
            return deleteResponse;
        } catch (error) {
            console.log(error);
            if (error.message === "Token verification failed") {
                let tokenResponse = buildResponse(401, "Token verification failed");
                console.log(tokenResponse);
                return tokenResponse;
            } else if (error.message === "Unauthorized user") {
                let tokenResponse = buildResponse(401, "Unauthorized user");
                console.log(tokenResponse);
                return tokenResponse;
            } else {
                let tokenResponse = buildResponse(500, "Internal Server error");
                console.log(tokenResponse);
                return tokenResponse;
            }
        }
    }
};
// deleteTaskHandler(event);
