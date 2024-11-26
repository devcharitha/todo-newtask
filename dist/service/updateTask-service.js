"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskService = void 0;
class UpdateTaskService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async updateTask(userId, taskId, status) {
        return this.todoRepository.updateTask(userId, taskId, status);
    }
}
exports.UpdateTaskService = UpdateTaskService;
//# sourceMappingURL=updateTask-service.js.map