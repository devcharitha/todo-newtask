"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskHandler = exports.updateTaskHandler = exports.getTasksHandler = exports.createTaskHandler = void 0;
const todo_builder_1 = require("../builder/todo-builder");
const uuid_1 = require("uuid");
const todo_repository_1 = require("../repository/todo-repository");
const createTask_service_1 = require("../service/createTask-service");
const getTasks_service_1 = require("../service/getTasks-service");
const updateTask_service_1 = require("../service/updateTask-service");
const deleteTask_service_1 = require("../service/deleteTask-service");
const createTaskService = new createTask_service_1.CreateTaskService(new todo_repository_1.TodoRepository());
const getTasksService = new getTasks_service_1.GetTasksService(new todo_repository_1.TodoRepository());
const updateTaskService = new updateTask_service_1.UpdateTaskService(new todo_repository_1.TodoRepository());
const deleteTaskService = new deleteTask_service_1.DeleteTaskService(new todo_repository_1.TodoRepository());
const createTaskHandler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const taskId = (0, uuid_1.v4)();
        const taskName = requestBody.taskName;
        const status = requestBody.status;
        const todoDetails = {
            taskId: taskId,
            taskName: taskName,
            status: status
        };
        await createTaskService.createTask(todoDetails);
        let response = (0, todo_builder_1.buildResponse)(201, 'Task added sucessfully');
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        let errorResponse = (0, todo_builder_1.buildResponse)(500, 'Internal server error');
        console.log(errorResponse);
        return errorResponse;
    }
};
exports.createTaskHandler = createTaskHandler;
const getTasksHandler = async (event) => {
    try {
        const tasks = await getTasksService.getAllTasks();
        let response = (0, todo_builder_1.buildResponse)(200, 'returned todo-list successfully', tasks);
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        let errorResponse = (0, todo_builder_1.buildResponse)(500, 'Internal server error');
        console.log(errorResponse);
        return errorResponse;
    }
};
exports.getTasksHandler = getTasksHandler;
const updateTaskHandler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const taskId = requestBody.taskId;
        const taskName = requestBody.taskName;
        const status = requestBody.status;
        await updateTaskService.updateTask(taskId, taskName, status);
        let response = (0, todo_builder_1.buildResponse)(200, 'Task updated successfully');
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        let errorResponse = (0, todo_builder_1.buildResponse)(500, 'Internal server error');
        console.log(errorResponse);
        return errorResponse;
    }
};
exports.updateTaskHandler = updateTaskHandler;
const deleteTaskHandler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const taskId = requestBody.taskId;
        await deleteTaskService.deleteTask(taskId);
        let response = (0, todo_builder_1.buildResponse)(200, 'Task deleted successfully');
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        let errorResponse = (0, todo_builder_1.buildResponse)(400, 'Bad request');
        console.log(errorResponse);
        return errorResponse;
    }
};
exports.deleteTaskHandler = deleteTaskHandler;
//# sourceMappingURL=todo-controller.js.map