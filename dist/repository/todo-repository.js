"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRepository = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
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
                tasks: requestBody.tasks
            }
        });
        const response = await this.client.send(command);
        console.log(response);
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
        console.log(response);
        return response;
    }
    async getUserTasks(userId) {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId,
            },
        });
        const response = await this.docClient.send(command);
        console.log(response);
        return response.Item.tasks;
    }
    async updateTask(userId, taskId, taskName, status) {
        const getCommand = new lib_dynamodb_1.GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId
            }
        });
        const response = await this.docClient.send(getCommand);
        const tasks = response.Item.tasks;
        const taskToUpdate = tasks.find((task) => task.taskId === taskId);
        if (taskToUpdate) {
            taskToUpdate.taskName = taskName;
            taskToUpdate.status = status;
            const updateCommand = new lib_dynamodb_1.UpdateCommand({
                TableName: "Todo",
                Key: {
                    userId: userId
                },
                UpdateExpression: "set tasks = :tasks",
                ExpressionAttributeValues: {
                    ":tasks": tasks
                }
            });
            const updateResponse = await this.docClient.send(updateCommand);
            console.log(updateResponse);
            return updateResponse;
        }
        else {
            return { error: "Task not found" };
        }
    }
    async deleteTask(userId, taskId) {
        const getCommand = new lib_dynamodb_1.GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId
            }
        });
        const response = await this.docClient.send(getCommand);
        const tasks = response.Item.tasks;
        const taskToDelete = tasks.find((task) => task.taskId === taskId);
        if (taskToDelete) {
            const updatedTasks = tasks.filter((task) => task.taskId !== taskId);
            const updateCommand = new lib_dynamodb_1.UpdateCommand({
                TableName: "Todo",
                Key: {
                    userId: userId
                },
                UpdateExpression: "set tasks = :tasks",
                ExpressionAttributeValues: {
                    ":tasks": updatedTasks
                }
            });
            const updateResponse = await this.docClient.send(updateCommand);
            console.log(updateResponse);
            return updateResponse;
        }
        else {
            return { error: "Task not found" };
        }
    }
}
exports.TodoRepository = TodoRepository;
//# sourceMappingURL=todo-repository.js.map