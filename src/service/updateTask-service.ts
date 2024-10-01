import { TodoRepository } from "../repository/todo-repository";

export class UpdateTaskService{
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }

    async updateTask(userId:string,taskId: string, taskName: string, status: string): Promise<any> {
        return this.todoRepository.updateTask(userId,taskId, taskName, status);
    }
}




