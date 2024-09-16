import { TodoRepository } from "../repository/todo-repository";
import { TodoDetails } from "../model/todo-model";

export class CreateTaskService{
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }

    async createTask(todoDetails:TodoDetails): Promise<any>{
        return await this.todoRepository.createTask(todoDetails);
    }
}