import { TodoRepository } from "../repository/todo-repository";
import { TodoDetails } from "../model/todo-model";

export class CreateUserService{
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }

    async createUser(todoDetails:TodoDetails): Promise<any>{
        return await this.todoRepository.createUser(todoDetails);
    }
}