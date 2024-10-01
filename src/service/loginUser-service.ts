import { TodoRepository } from "../repository/todo-repository";
import { TodoDetails } from "../model/todo-model";

export class LoginUserService {
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }


  async loginUserByUserId(userId: string): Promise<TodoDetails> {
    return await this.todoRepository.loginUserByUserId(userId);
  }
}