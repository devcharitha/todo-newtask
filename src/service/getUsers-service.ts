import { TodoRepository } from "../repository/todo-repository";

export class GetUsersService{
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }

    async getUsers(): Promise<any>{
        return await this.todoRepository.getUsers();
    }
}