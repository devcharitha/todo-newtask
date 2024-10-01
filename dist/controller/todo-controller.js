"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskHandler = exports.updateTaskHandler = exports.getUsersHandler = exports.loginUserHandler = exports.createUserHandler = void 0;
const todo_builder_1 = require("../builder/todo-builder");
const uuid_1 = require("uuid");
const todo_repository_1 = require("../repository/todo-repository");
const createUser_service_1 = require("../service/createUser-service");
const getUsers_service_1 = require("../service/getUsers-service");
const updateTask_service_1 = require("../service/updateTask-service");
const deleteTask_service_1 = require("../service/deleteTask-service");
const validation_service_1 = require("../service/validation-service");
const loginUser_service_1 = require("../service/loginUser-service");
const token_service_1 = require("../service/token-service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUserService = new createUser_service_1.CreateUserService(new todo_repository_1.TodoRepository());
const getUsersService = new getUsers_service_1.GetUsersService(new todo_repository_1.TodoRepository());
const updateTaskService = new updateTask_service_1.UpdateTaskService(new todo_repository_1.TodoRepository());
const deleteTaskService = new deleteTask_service_1.DeleteTaskService(new todo_repository_1.TodoRepository());
const loginUserService = new loginUser_service_1.LoginUserService(new todo_repository_1.TodoRepository());
const validationService = new validation_service_1.ValidationService(loginUserService);
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
        let response = (0, todo_builder_1.buildResponse)(201, 'Task added successfully');
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        let errorResponse = (0, todo_builder_1.buildResponse)(400, 'Not able to add task');
        console.log(errorResponse);
        return errorResponse;
    }
};
exports.createUserHandler = createUserHandler;
const loginUserHandler = async (event) => {
    const requestBody = JSON.parse(event.body);
    try {
        validationService.validateUserId(requestBody.userId);
        validationService.validatePassword(requestBody.password);
        const credentials = await validationService.validateUser(requestBody.userId, requestBody.password);
        const tokenResponse = (0, token_service_1.createJWT)(credentials);
        let response = (0, todo_builder_1.buildAuthenticateResponse)(200, 'Generated code successfully', tokenResponse);
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        if (error.message === "Invalid UserId format" || error.message === "Invalid Password format") {
            let errorMessage = (0, todo_builder_1.buildResponse)(400, error.message);
            console.log(errorMessage);
            return errorMessage;
        }
        else if (error.message === "Unauthorized") {
            let err = (0, todo_builder_1.buildResponse)(401, error.message);
            console.log(err);
            return err;
        }
        else {
            let error = (0, todo_builder_1.buildResponse)(500, 'Internal server error');
            console.log(error);
            return error;
        }
    }
};
exports.loginUserHandler = loginUserHandler;
const getUsersHandler = async (event) => {
    try {
        const tasks = await getUsersService.getUsers();
        let response = (0, todo_builder_1.buildResponse)(200, 'Retrived all users', tasks);
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        let errorResponse = (0, todo_builder_1.buildResponse)(400, 'Cannot retrive users');
        console.log(errorResponse);
        return errorResponse;
    }
};
exports.getUsersHandler = getUsersHandler;
const updateTaskHandler = async (event) => {
    try {
        const token = event.headers.Authorization.split(' ')[1];
        const decodedToken = (0, token_service_1.verifyJWT)(token);
        const userId = decodedToken.userId;
        const requestBody = JSON.parse(event.body);
        const taskId = requestBody.taskId;
        const taskName = requestBody.taskName;
        const status = requestBody.status;
        await updateTaskService.updateTask(userId, taskId, taskName, status);
        let response = (0, todo_builder_1.buildResponse)(200, 'Task updated successfully');
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        let errorResponse = (0, todo_builder_1.buildResponse)(400, 'Bad request cannot update the task');
        console.log(errorResponse);
        return errorResponse;
    }
};
exports.updateTaskHandler = updateTaskHandler;
const deleteTaskHandler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const userId = requestBody.userId;
        const taskId = requestBody.taskId;
        await deleteTaskService.deleteTask(userId, taskId);
        let response = (0, todo_builder_1.buildResponse)(200, 'Task deleted successfully');
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        let errorResponse = (0, todo_builder_1.buildResponse)(400, 'Bad request cannot delete task');
        console.log(errorResponse);
        return errorResponse;
    }
};
exports.deleteTaskHandler = deleteTaskHandler;
//# sourceMappingURL=todo-controller.js.map