"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJWT = createJWT;
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
function createJWT(credentials) {
    const payload = {
        userId: credentials.userId,
    };
    const secretKey = 'todoTasks';
    const options = {
        expiresIn: '200s'
    };
    try {
        const token = jsonwebtoken_1.default.sign(payload, secretKey, options);
        const jti = (0, uuid_1.v4)();
        console.log('Token generated:', token);
        return buildTokenResponse(token, jti);
    }
    catch (error) {
        console.error('JWT Error:', error);
        throw new Error('jwt Error');
    }
}
function buildTokenResponse(token, jti) {
    return {
        token,
        token_type: "bearer",
        expires_in: '200s',
        scope: "read admin",
        jti
    };
}
function verifyJWT(token) {
    const secretKey = 'todoTasks';
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid token');
    }
}
//# sourceMappingURL=token-service.js.map