export function validateUserName(userName:string): boolean {
    const userNameRegex= /^[A-Z][a-zA-Z]{7,14}$/;
    return userNameRegex.test(userName)
}
export function validateUserId(userId: string): boolean {
    const userIdRegex = /^[a-z0-9]{6,10}$/;
    return userIdRegex.test(userId);
}
export function validatePassword(password: string): boolean {
    const passwordRegex = /^[A-Z][\w@#$%&!]{5,11}$/;
    return passwordRegex.test(password);
}
export function validateTaskName(taskName: string): boolean {
    const taskNameRegex = /^[a-zA-Z\s]+$/;
    return taskNameRegex.test(taskName);
}

export function validateStatus(status: string): boolean {
    return status === "Completed" || status === "Incomplete";
}
