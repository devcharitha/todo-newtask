import { TodoRepository } from "../repository/todo-repository";

export class GetUserTasksService{
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }

    async getUserTasks(userId:string): Promise<any>{
        return await this.todoRepository.getUserTasks(userId);
    }
}