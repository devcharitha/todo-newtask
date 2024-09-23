import { TodoRepository } from "../repository/todo-repository";

export class UpdateTaskService{
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }

    async updateTask(taskId: string, taskName: string, status: string): Promise<any> {
        return this.todoRepository.updateTask(taskId, taskName, status);
    }
}




