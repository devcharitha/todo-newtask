import { TodoRepository } from "../repository/todo-repository";
import { TaskDetails } from "../model/todo-model";

export class GetUserTasksService{
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }

    async getUserTasks(userId:string): Promise<TaskDetails[]>{
        return await this.todoRepository.getUserTasks(userId);
    }
}