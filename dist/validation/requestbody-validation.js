"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserName = validateUserName;
exports.validateUserId = validateUserId;
exports.validatePassword = validatePassword;
exports.validateTaskName = validateTaskName;
exports.validateStatus = validateStatus;
function validateUserName(userName) {
    const userNameRegex = /^[A-Z][a-zA-Z]{7,14}$/;
    return userNameRegex.test(userName);
}
function validateUserId(userId) {
    const userIdRegex = /^[a-f0-9]{6,10}$/;
    return userIdRegex.test(userId);
}
function validatePassword(password) {
    const passwordRegex = /^[A-Z][\w@#$%&!]{5,11}$/;
    return passwordRegex.test(password);
}
function validateTaskName(taskName) {
    const taskNameRegex = /^[a-zA-Z\s]+$/;
    return taskNameRegex.test(taskName);
}
function validateStatus(status) {
    return status === "completed" || status === "Incomplete";
}
//# sourceMappingURL=requestBody-validation.js.map