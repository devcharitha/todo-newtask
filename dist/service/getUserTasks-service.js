"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserTasksService = void 0;
class GetUserTasksService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async getUserTasks(userId) {
        return await this.todoRepository.getUserTasks(userId);
    }
}
exports.GetUserTasksService = GetUserTasksService;
//# sourceMappingURL=getUserTasks-service.js.map