import { buildSuccessResponse } from "../builder/todo-builder";
import { TodoRepository } from "../repository/todo-repository";
import { CreateTaskService } from "../service/createTask-service";

const createTaskService = new CreateTaskService(new TodoRepository)
export const createTaskHandler = async (event)=>{

};
export const getTasksHandler = async (event)=>{

};
export const updateTaskHandler = async (event)=>{

};
export const deleteTaskHandler = async (event)=>{

};