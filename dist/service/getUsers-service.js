"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersService = void 0;
class GetUsersService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async getUsers() {
        return await this.todoRepository.getUsers();
    }
}
exports.GetUsersService = GetUsersService;
//# sourceMappingURL=getUsers-service.js.map