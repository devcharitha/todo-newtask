"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserService = void 0;
class LoginUserService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async loginUserByUserId(id) {
        let response = await this.todoRepository.loginUserByUserId(id);
        let { userId, password } = response.Item;
        return { userId, password };
    }
}
exports.LoginUserService = LoginUserService;
//# sourceMappingURL=loginUser-service.js.map