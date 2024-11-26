import { TodoRepository } from "../repository/todo-repository";
import { TaskDetails } from "../model/todo-model";

export class CreateTaskService {
    private todoRepository: TodoRepository;

    constructor(todoRepository: TodoRepository) {
        this.todoRepository = todoRepository;
    }

    async createTask(userId: string, taskDetails: TaskDetails): Promise<TaskDetails> {
        return await this.todoRepository.createTask(userId, taskDetails);
    }
}