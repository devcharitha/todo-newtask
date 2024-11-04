"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTasksService = void 0;
class GetTasksService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async getAllTasks() {
        return await this.todoRepository.getAllTasks();
    }
}
exports.GetTasksService = GetTasksService;
//# sourceMappingURL=getTasks-service.js.map