"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRepository = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const uuid_1 = require("uuid");
class TodoRepository {
    client;
    docClient;
    constructor() {
        this.client = new client_dynamodb_1.DynamoDBClient({ region: "us-west-2" });
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(this.client);
    }
    async createUser(requestBody) {
        const command = new lib_dynamodb_1.PutCommand({
            TableName: "Todo",
            Item: {
                userName: requestBody.userName,
                userId: requestBody.userId,
                password: requestBody.password,
            }
        });
        const response = await this.client.send(command);
        console.log("Create User Response:", response);
        return response;
    }
    async loginUserByUserId(userId) {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId,
            },
        });
        const response = await this.docClient.send(command);
        console.log("Login User Response:", response);
        return response;
    }
    async createTask(userId, requestBody) {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId
            }
        });
        const response = await this.docClient.send(command);
        if (response.Item) {
            const newTask = {
                taskId: (0, uuid_1.v4)(),
                taskName: requestBody.taskName,
                status: requestBody.status
            };
            const existingTasks = response.Item.tasks || [];
            const updatedTasks = [...existingTasks, newTask];
            const command1 = new lib_dynamodb_1.PutCommand({
                TableName: "Todo-task",
                Item: {
                    userId: response.Item.userId,
                    tasks: updatedTasks
                }
            });
            const res = await this.docClient.send(command1);
            console.log("Create Task Response:", res);
            return newTask;
        }
        else {
            throw new Error("User not found to create task");
        }
    }
    async getUserTasks(userId) {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: "Todo-task",
            Key: {
                userId: userId
            }
        });
        const response = await this.docClient.send(command);
        console.log("Get User Tasks Response:", response);
        if (response.Item) {
            return response.Item.tasks || [];
        }
        else {
            throw new Error("User not found");
        }
    }
    async updateTask(userId, taskId, newStatus) {
        const tasks = await this.getUserTasks(userId);
        const taskIndex = tasks.findIndex(task => task.taskId === taskId);
        if (taskIndex === -1) {
            throw new Error("Task not found");
        }
        tasks[taskIndex].status = newStatus;
        const command = new lib_dynamodb_1.PutCommand({
            TableName: "Todo-task",
            Item: {
                userId: userId,
                tasks: tasks
            }
        });
        const response = await this.docClient.send(command);
        console.log("Update Task Status Response:", response);
        return tasks[taskIndex];
    }
    async deleteTask(userId, taskId) {
        const tasks = await this.getUserTasks(userId);
        const taskIndex = tasks.findIndex(task => task.taskId === taskId);
        if (taskIndex === -1) {
            throw new Error("Task not found");
        }
        const updatedTasks = tasks.filter(task => task.taskId !== taskId);
        const command = new lib_dynamodb_1.PutCommand({
            TableName: "Todo-task",
            Item: {
                userId: userId,
                tasks: updatedTasks
            }
        });
        const response = await this.docClient.send(command);
        console.log("Delete Task Response:", response);
    }
}
exports.TodoRepository = TodoRepository;
//# sourceMappingURL=todo-repository.js.map