import { TodoRepository } from "../repository/todo-repository";
import { User } from "../model/todo-model";

export class LoginUserService {
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }
  async loginUserByUserId(id: string): Promise<User> {
    let response:any = await this.todoRepository.loginUserByUserId(id);
    return response.Item;
  }
}