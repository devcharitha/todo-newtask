"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskHandler = exports.updateTaskHandler = exports.getUserTasksHandler = exports.loginUserHandler = exports.createUserHandler = void 0;
const todo_builder_1 = require("../builder/todo-builder");
const uuid_1 = require("uuid");
const todo_repository_1 = require("../repository/todo-repository");
const createUser_service_1 = require("../service/createUser-service");
const getUserTasks_service_1 = require("../service/getUserTasks-service");
const updateTask_service_1 = require("../service/updateTask-service");
const deleteTask_service_1 = require("../service/deleteTask-service");
const validation_service_1 = require("../service/validation-service");
const loginUser_service_1 = require("../service/loginUser-service");
const token_service_1 = require("../service/token-service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUserService = new createUser_service_1.CreateUserService(new todo_repository_1.TodoRepository());
const getUserTasksService = new getUserTasks_service_1.GetUserTasksService(new todo_repository_1.TodoRepository());
const updateTaskService = new updateTask_service_1.UpdateTaskService(new todo_repository_1.TodoRepository());
const deleteTaskService = new deleteTask_service_1.DeleteTaskService(new todo_repository_1.TodoRepository());
const loginUserService = new loginUser_service_1.LoginUserService(new todo_repository_1.TodoRepository());
const validationService = new validation_service_1.ValidationService(loginUserService);
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
const createUserHandler = async (event) => {
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
        const taskId = (0, uuid_1.v4)();
        const taskName = requestBody.taskName;
        const status = requestBody.status;
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(plainPassword, saltRounds);
        const task = {
            taskId: taskId,
            taskName: taskName,
            status: status
        };
        const todoDetails = {
            userId: userId,
            userName: userName,
            password: hashedPassword,
            tasks: [task]
        };
        await createUserService.createUser(todoDetails);
        let response = (0, todo_builder_1.buildSuccessResponse)(201, 'User added successfully');
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        console.log(error);
        if (error instanceof Error) {
            let errorResponse = (0, todo_builder_1.buildErrorResponse)(400, 'Not able to add user');
            console.log(errorResponse);
            return errorResponse;
        }
        else {
            let errorResponse = (0, todo_builder_1.buildErrorResponse)(500, 'Internal Server Error');
            console.log(errorResponse);
            return errorResponse;
        }
    }
};
exports.createUserHandler = createUserHandler;
// createUserHandler(event);
const loginUserHandler = async (event) => {
    const requestBody = JSON.parse(event.body);
    try {
        validationService.validateUserId(requestBody.userId);
        validationService.validatePassword(requestBody.password);
        const userId = await validationService.validateUser(requestBody);
        const tokenResponse = (0, token_service_1.createJWT)(userId);
        let response = (0, todo_builder_1.buildAuthenticateResponse)(200, 'Generated code successfully', tokenResponse);
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        if (error.message === "Invalid UserId format" || error.message === "Invalid Password format") {
            let errorMessage = (0, todo_builder_1.buildErrorResponse)(400, error.message);
            console.log(errorMessage);
            return errorMessage;
        }
        else if (error.message === "Unauthorized") {
            let err = (0, todo_builder_1.buildErrorResponse)(401, error.message);
            console.log(err);
            return err;
        }
        else {
            let error = (0, todo_builder_1.buildErrorResponse)(500, 'Internal server error');
            console.log(error);
            return error;
        }
    }
};
exports.loginUserHandler = loginUserHandler;
// loginUserHandler(event);
const getUserTasksHandler = async (event) => {
    let userId = event.pathParameters.userId;
    const authHeaders = event.headers['Authorization'];
    if (!authHeaders) {
        return (0, todo_builder_1.buildErrorResponse)(400, "Authorization header not found");
    }
    else if (!userId) {
        return (0, todo_builder_1.buildErrorResponse)(400, "No parameters");
    }
    else {
        try {
            const token = authHeaders.split(' ')[1];
            if (!token) {
                console.log("No Token");
                return (0, todo_builder_1.buildErrorResponse)(400, "Authorization token is required");
            }
            await (0, token_service_1.verifyJWT)(token);
            const tasks = await getUserTasksService.getUserTasks(userId);
            let userTasks = (0, todo_builder_1.buildUserResponse)(200, 'Retrived all tasks of user', JSON.stringify(tasks));
            console.log(userTasks);
            return userTasks;
        }
        catch (error) {
            if (error.message === "Token verification failed") {
                let tokenResponse = (0, todo_builder_1.buildErrorResponse)(401, "Token verification failed");
                console.log(tokenResponse);
                return tokenResponse;
            }
            else if (error.message === "Unauthorized user") {
                let tokenResponse = (0, todo_builder_1.buildErrorResponse)(401, "Unauthorized user");
                console.log(tokenResponse);
                return tokenResponse;
            }
            else {
                let tokenResponse = (0, todo_builder_1.buildErrorResponse)(500, "Internal Server error");
                console.log(tokenResponse);
                return tokenResponse;
            }
        }
    }
};
exports.getUserTasksHandler = getUserTasksHandler;
// getUserTasksHandler(event);
const updateTaskHandler = async (event) => {
    let userId = event.pathParameters.userId;
    const authHeaders = event.headers['Authorization'];
    const requestBody = JSON.parse(event.body);
    if (!authHeaders) {
        console.log("No Auth");
        return (0, todo_builder_1.buildErrorResponse)(400, "Authorization header not found");
    }
    else if (!userId) {
        return (0, todo_builder_1.buildErrorResponse)(400, "No user id found");
    }
    else if (!requestBody) {
        return (0, todo_builder_1.buildErrorResponse)(400, "No request body found");
    }
    else {
        try {
            const token = authHeaders.split(' ')[1];
            if (!token) {
                console.log("No Token");
                return (0, todo_builder_1.buildErrorResponse)(400, "Authorization token is required");
            }
            await (0, token_service_1.verifyJWT)(token);
            const taskId = requestBody.taskId;
            const taskName = requestBody.taskName;
            const status = requestBody.status;
            await updateTaskService.updateTask(userId, taskId, taskName, status);
            let updatedResponse = (0, todo_builder_1.buildSuccessResponse)(200, 'Task updated successfully');
            console.log(updatedResponse);
            return updatedResponse;
        }
        catch (error) {
            console.log(error);
            if (error.message === "Token verification failed") {
                let tokenResponse = (0, todo_builder_1.buildErrorResponse)(401, "Token verification failed");
                console.log(tokenResponse);
                return tokenResponse;
            }
            else if (error.message === "Unauthorized user") {
                let tokenResponse = (0, todo_builder_1.buildErrorResponse)(401, "Unauthorized user");
                console.log(tokenResponse);
                return tokenResponse;
            }
            else {
                let tokenResponse = (0, todo_builder_1.buildErrorResponse)(500, "Internal Server error");
                console.log(tokenResponse);
                return tokenResponse;
            }
        }
    }
};
exports.updateTaskHandler = updateTaskHandler;
// updateTaskHandler(event);
const deleteTaskHandler = async (event) => {
    let userId = event.pathParameters.userId;
    const authHeaders = event.headers['Authorization'];
    const requestBody = JSON.parse(event.body);
    if (!authHeaders) {
        console.log("No Auth");
        return (0, todo_builder_1.buildErrorResponse)(400, "Authorization header not found");
    }
    else if (!userId) {
        return (0, todo_builder_1.buildErrorResponse)(400, "No user id found");
    }
    else if (!requestBody) {
        return (0, todo_builder_1.buildErrorResponse)(400, "No request body found");
    }
    else {
        try {
            const token = authHeaders.split(' ')[1];
            if (!token) {
                console.log("No Token");
                return (0, todo_builder_1.buildErrorResponse)(400, "Authorization token is required");
            }
            await (0, token_service_1.verifyJWT)(token);
            const taskId = requestBody.taskId;
            await deleteTaskService.deleteTask(userId, taskId);
            let deleteResponse = (0, todo_builder_1.buildSuccessResponse)(204, 'Task deleted successfully');
            console.log(deleteResponse);
            return deleteResponse;
        }
        catch (error) {
            console.log(error);
            if (error.message === "Token verification failed") {
                let tokenResponse = (0, todo_builder_1.buildErrorResponse)(401, "Token verification failed");
                console.log(tokenResponse);
                return tokenResponse;
            }
            else if (error.message === "Unauthorized user") {
                let tokenResponse = (0, todo_builder_1.buildErrorResponse)(401, "Unauthorized user");
                console.log(tokenResponse);
                return tokenResponse;
            }
            else {
                let tokenResponse = (0, todo_builder_1.buildErrorResponse)(500, "Internal Server error");
                console.log(tokenResponse);
                return tokenResponse;
            }
        }
    }
};
exports.deleteTaskHandler = deleteTaskHandler;
// deleteTaskHandler(event);
//# sourceMappingURL=todo-controller.js.map