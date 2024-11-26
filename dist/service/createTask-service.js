"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskService = void 0;
class CreateTaskService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async createTask(userId, taskDetails) {
        return await this.todoRepository.createTask(userId, taskDetails);
    }
}
exports.CreateTaskService = CreateTaskService;
//# sourceMappingURL=createTask-service.js.map