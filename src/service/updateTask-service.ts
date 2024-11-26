import { TodoRepository } from "../repository/todo-repository";

export class UpdateTaskService{
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }

    async updateTask(userId:string,taskId: string, status: string): Promise<any> {
        return this.todoRepository.updateTask(userId,taskId,status);
    }
}




