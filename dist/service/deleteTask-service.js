"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTaskService = void 0;
class DeleteTaskService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async deleteTask(taskId) {
        return await this.todoRepository.deleteTask(taskId);
    }
}
exports.DeleteTaskService = DeleteTaskService;
//# sourceMappingURL=deleteTask-service.js.map