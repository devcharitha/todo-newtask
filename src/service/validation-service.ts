import { TodoUserDetails, User } from '../model/todo-model';
import bcrypt from 'bcryptjs';
import { LoginUserService } from '../service/loginUser-service';
import {validateUserName,validateUserId,validatePassword,validateTaskName,validateStatus} from '../validation/request-validation';

export class ValidationService {
    private loginUserService: LoginUserService;

    constructor(loginUserService: LoginUserService) {
        this.loginUserService = loginUserService;
    }
    validateUserName(userName: string): void {
        if (!validateUserName(userName)) {
            throw new Error("Invalid UserName format");
        }
    }
    validateUserId(userId: string): void {
        if (!validateUserId(userId)) {
            throw new Error("Invalid UserId format");
        }
    }
    validateTaskName(taskName: string): void {
        if (!validateTaskName(taskName)) {
            throw new Error("Invalid TaskName format");
        }
    }
    validateStatus(status: string): void {
        if (!validateStatus(status)) {
            throw new Error("Invalid status content");
        }
    }
    validatePassword(password: string): void {
        if (!validatePassword(password)) {
            throw new Error("Invalid Password format");
        }
    }
    async validateUser({userId, password}): Promise<string> {
        try {
            const user: User = await this.loginUserService.loginUserByUserId(userId);
            let isPasswordValid = false
            if(user){
                isPasswordValid = await bcrypt.compare(password, user.password);
            }
        if (!user || user.userId !== userId || !isPasswordValid) {
            throw new Error('Unauthorized');
        }
            return user.userId;
        
        } catch (error) {
            throw error;
        }
    }

}