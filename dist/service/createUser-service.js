"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
class CreateUserService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async createUser(todoDetails) {
        return await this.todoRepository.createUser(todoDetails);
    }
}
exports.CreateUserService = CreateUserService;
//# sourceMappingURL=createUser-service.js.map