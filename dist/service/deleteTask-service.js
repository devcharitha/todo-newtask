"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTaskService = void 0;
class DeleteTaskService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async deleteTask(userId, taskId) {
        return await this.todoRepository.deleteTask(userId, taskId);
    }
}
exports.DeleteTaskService = DeleteTaskService;
//# sourceMappingURL=deleteTask-service.js.map