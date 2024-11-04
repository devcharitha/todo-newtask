"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskService = void 0;
class CreateTaskService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async createTask(todoDetails) {
        return await this.todoRepository.createTask(todoDetails);
    }
}
exports.CreateTaskService = CreateTaskService;
//# sourceMappingURL=createTask-service.js.map