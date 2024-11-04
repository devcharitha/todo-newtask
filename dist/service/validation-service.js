"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const request_validation_1 = require("../validation/request-validation");
class ValidationService {
    loginUserService;
    constructor(loginUserService) {
        this.loginUserService = loginUserService;
    }
    validateUserName(userName) {
        if (!(0, request_validation_1.validateUserName)(userName)) {
            throw new Error("Invalid UserName format");
        }
    }
    validateUserId(userId) {
        if (!(0, request_validation_1.validateUserId)(userId)) {
            throw new Error("Invalid UserId format");
        }
    }
    validateTaskName(taskName) {
        if (!(0, request_validation_1.validateTaskName)(taskName)) {
            throw new Error("Invalid TaskName format");
        }
    }
    validateStatus(status) {
        if (!(0, request_validation_1.validateStatus)(status)) {
            throw new Error("Invalid status content");
        }
    }
    validatePassword(password) {
        if (!(0, request_validation_1.validatePassword)(password)) {
            throw new Error("Invalid Password format");
        }
    }
    async validateUser({ userId, password }) {
        try {
            const user = await this.loginUserService.loginUserByUserId(userId);
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!user || user.userId !== userId || !isPasswordValid) {
                throw new Error('Unauthorized');
            }
            return user.userId;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ValidationService = ValidationService;
//# sourceMappingURL=validation-service.js.map