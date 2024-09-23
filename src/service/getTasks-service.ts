import { TodoRepository } from "../repository/todo-repository";

export class GetTasksService{
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }

    async getAllTasks(): Promise<any>{
        return await this.todoRepository.getAllTasks();
    }
}