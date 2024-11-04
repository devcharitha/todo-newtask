import { TodoRepository } from "../repository/todo-repository";
import { TodoDetails, User } from "../model/todo-model";

export class LoginUserService {
    private todoRepository:TodoRepository;

    constructor(todoRepository:TodoRepository){
        this.todoRepository=todoRepository;
    }


  async loginUserByUserId(id: string): Promise<User> {
    let response:any = await this.todoRepository.loginUserByUserId(id);
    let {userId, password} = response.Item;
    return {userId, password};
  }
}