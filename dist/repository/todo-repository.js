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
    async getUsers() {
        const command = new lib_dynamodb_1.ScanCommand({
            TableName: "Todo",
        });
        const response = await this.docClient.send(command);
        console.log(response);
        return response.Items;
    }
    async updateTask(userId, taskId, taskName, status) {
        const command = new lib_dynamodb_1.UpdateCommand({
            TableName: "Todo",
            Key: {
                userId: userId,
                "tasks.taskId": taskId
            },
            UpdateExpression: "set taskName = :taskName, #status = :status",
            ExpressionAttributeValues: {
                ":taskName": taskName,
                ":status": status
            },
            ExpressionAttributeNames: {
                "#status": "status"
            }
        });
        const response = await this.docClient.send(command);
        console.log(response);
        return response;
    }
    async deleteTask(userId, taskId) {
        const command = new lib_dynamodb_1.UpdateCommand({
            TableName: "Todo",
            Key: {
                userId: userId
            },
            UpdateExpression: "REMOVE tasks[$.taskId = :taskId]",
            ExpressionAttributeValues: {
                ":taskId": taskId
            }
        });
        const response = await this.docClient.send(command);
        console.log(response);
        return response;
    }
}
exports.TodoRepository = TodoRepository;
//# sourceMappingURL=todo-repository.js.map