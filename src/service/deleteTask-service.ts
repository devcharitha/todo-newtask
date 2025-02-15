import { TodoRepository } from "../repository/todo-repository";

export class DeleteTaskService{
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }

    async deleteTask(userId:string,taskId:string): Promise<any>{
        return await this.todoRepository.deleteTask(userId,taskId);
    }
}