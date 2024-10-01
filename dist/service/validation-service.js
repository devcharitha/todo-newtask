"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const requestBody_validation_1 = require("../validation/requestBody-validation");
class ValidationService {
    loginUserService;
    constructor(loginUserService) {
        this.loginUserService = loginUserService;
    }
    validateUserName(userName) {
        if (!(0, requestBody_validation_1.validateUserName)(userName)) {
            throw new Error("Invalid UserName format");
        }
    }
    validateUserId(userId) {
        if (!(0, requestBody_validation_1.validateUserId)(userId)) {
            throw new Error("Invalid UserId format");
        }
    }
    validateTaskName(taskName) {
        if (!(0, requestBody_validation_1.validateTaskName)(taskName)) {
            throw new Error("Invalid TaskName format");
        }
    }
    validateStatus(status) {
        if (!(0, requestBody_validation_1.validateStatus)(status)) {
            throw new Error("Invalid status content");
        }
    }
    validatePassword(password) {
        if (!(0, requestBody_validation_1.validatePassword)(password)) {
            throw new Error("Invalid Password format");
        }
    }
    async validateUser(userId, password) {
        try {
            const credentials = await this.loginUserService.loginUserByUserId(userId);
            if (!credentials || credentials.Item.userId !== userId || credentials.Item.password !== password) {
                throw new Error('Unauthorized');
            }
            return credentials;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ValidationService = ValidationService;
//# sourceMappingURL=validation-service.js.map