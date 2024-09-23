import { buildResponse } from "../builder/todo-builder";
import { v4 as uuidv4 } from 'uuid';
import { TodoRepository } from "../repository/todo-repository";
import { CreateTaskService } from "../service/createTask-service";
import { GetTasksService } from "../service/getTasks-service";
import { TodoDetails } from "../model/todo-model";
import { UpdateTaskService } from "../service/updateTask-service";
import { DeleteTaskService } from "../service/deleteTask-service";

const createTaskService = new CreateTaskService(new TodoRepository());
const getTasksService = new GetTasksService(new TodoRepository());
const updateTaskService= new UpdateTaskService( new TodoRepository());
const deleteTaskService=new DeleteTaskService(new TodoRepository());

export const createTaskHandler = async (event)=>{
    try {
        const requestBody = JSON.parse(event.body);
        const taskId = uuidv4();
        const taskName = requestBody.taskName;
        const status = requestBody.status;

        const todoDetails: TodoDetails = {
            taskId: taskId,
            taskName: taskName,
            status: status
        };

        await createTaskService.createTask(todoDetails);
        let response = buildResponse(201,'Task added sucessfully');
        console.log(response);
        return response;

    } catch (error) {
        console.log(error);
        let errorResponse = buildResponse(500, 'Internal server error');
        console.log(errorResponse);
        return errorResponse;
    }
};
export const getTasksHandler = async (event)=>{
    try {
        const tasks = await getTasksService.getAllTasks();
        let response=buildResponse(200,'returned todo-list successfully',tasks);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        let errorResponse = buildResponse(500, 'Internal server error');
        console.log(errorResponse);
        return errorResponse;
    }

};
export const updateTaskHandler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const taskId = requestBody.taskId;
        const taskName = requestBody.taskName;
        const status = requestBody.status;

        await updateTaskService.updateTask(taskId, taskName, status);
        let response = buildResponse(200, 'Task updated successfully');
        console.log(response);
        return response;

    } catch (error) {
        console.log(error);
        let errorResponse = buildResponse(500, 'Internal server error');
        console.log(errorResponse);
        return errorResponse;
    }
};

export const deleteTaskHandler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const taskId = requestBody.taskId;

        await deleteTaskService.deleteTask(taskId);
        let response = buildResponse(200, 'Task deleted successfully');
        console.log(response);
        return response;

    } catch (error) {
        console.log(error);
        let errorResponse = buildResponse(400, 'Bad request');
        console.log(errorResponse);
        return errorResponse;
    }
};
