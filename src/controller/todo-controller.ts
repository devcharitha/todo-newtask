import { buildAuthenticateResponse, buildResponse } from "../builder/todo-builder";
import { v4 as uuidv4 } from 'uuid';
import { TodoRepository } from "../repository/todo-repository";
import { CreateUserService } from "../service/createUser-service";
import { GetUsersService } from "../service/getUsers-service";
import { Taskdetails, TodoDetails } from "../model/todo-model";
import { UpdateTaskService } from "../service/updateTask-service";
import { DeleteTaskService } from "../service/deleteTask-service";
import { ValidationService } from "../service/validation-service";
import { LoginUserService } from "../service/loginUser-service";
import { createJWT, verifyJWT } from "../service/token-service";
import bcrypt from 'bcryptjs';

const createUserService = new CreateUserService(new TodoRepository());
const getUsersService = new GetUsersService(new TodoRepository());
const updateTaskService = new UpdateTaskService(new TodoRepository());
const deleteTaskService = new DeleteTaskService(new TodoRepository());
const loginUserService = new LoginUserService(new TodoRepository());
const validationService = new ValidationService(loginUserService);


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
        let response = buildResponse(201, 'Task added successfully');
        console.log(response);
        return response;

    } catch (error) {
        console.log(error);
        let errorResponse = buildResponse(400, 'Not able to add task');
        console.log(errorResponse);
        return errorResponse;
    }
};



export const loginUserHandler = async (event)=>{
    const requestBody = JSON.parse(event.body);
    try{
        validationService.validateUserId(requestBody.userId);
        validationService.validatePassword(requestBody.password);
        const credentials = await validationService.validateUser(requestBody.userId, requestBody.password);
        const tokenResponse = createJWT(credentials);
        let response = buildAuthenticateResponse(200, 'Generated code successfully', tokenResponse);
        console.log(response);
        return response;
    }
    catch(error){
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
export const getUsersHandler = async (event)=>{
    try {
        const tasks = await getUsersService.getUsers();
        let response=buildResponse(200,'Retrived all users',tasks);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        let errorResponse = buildResponse(400, 'Cannot retrive users');
        console.log(errorResponse);
        return errorResponse;
    }

};
export const updateTaskHandler = async (event) => {
    try {
        const token = event.headers.Authorization.split(' ')[1];
        const decodedToken = verifyJWT(token);
        const userId = decodedToken.userId;

        const requestBody = JSON.parse(event.body);
        const taskId = requestBody.taskId;
        const taskName = requestBody.taskName;
        const status = requestBody.status;

        await updateTaskService.updateTask(userId, taskId, taskName, status);
        let response = buildResponse(200, 'Task updated successfully');
        console.log(response);
        return response;

    } catch (error) {
        console.log(error);
        let errorResponse = buildResponse(400, 'Bad request cannot update the task');
        console.log(errorResponse);
        return errorResponse;
    }
};

export const deleteTaskHandler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const userId=requestBody.userId
        const taskId = requestBody.taskId;

        await deleteTaskService.deleteTask(userId,taskId);
        let response = buildResponse(200, 'Task deleted successfully');
        console.log(response);
        return response;

    } catch (error) {
        console.log(error);
        let errorResponse = buildResponse(400, 'Bad request cannot delete task');
        console.log(errorResponse);
        return errorResponse;
    }
};
