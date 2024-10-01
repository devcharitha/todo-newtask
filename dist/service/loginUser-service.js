"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserService = void 0;
class LoginUserService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async loginUserByUserId(userId) {
        return await this.todoRepository.loginUserByUserId(userId);
    }
}
exports.LoginUserService = LoginUserService;
//# sourceMappingURL=loginUser-service.js.map