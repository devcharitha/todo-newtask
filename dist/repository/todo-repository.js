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
    async createTask(requestBody) {
        const command = new lib_dynamodb_1.PutCommand({
            TableName: "EcommerceSignup",
            Item: {
                taskName: requestBody.taskName,
                status: requestBody.status
            }
        });
        const response = await this.client.send(command);
        console.log(response);
        return response;
    }
    async getAllTasks() {
        const command = new lib_dynamodb_1.ScanCommand({
            TableName: "EcommerceSignup",
        });
        const response = await this.docClient.send(command);
        console.log(response);
        return response.Items;
    }
    async updateTask(taskId, taskName, status) {
        const command = new lib_dynamodb_1.UpdateCommand({
            TableName: "EcommerceSignup",
            Key: {
                taskId: taskId
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
    async deleteTask(taskId) {
        const command = new lib_dynamodb_1.DeleteCommand({
            TableName: "EcommerceSignup",
            Key: {
                taskId: taskId
            }
        });
        const response = await this.docClient.send(command);
        console.log(response);
        return response;
    }
}
exports.TodoRepository = TodoRepository;
//# sourceMappingURL=todo-repository.js.map