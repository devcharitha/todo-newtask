"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRepository = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class TodoRepository {
    client;
    docClint;
    constructor() {
        this.client = new client_dynamodb_1.DynamoDBClient({ region: "us-west-2" });
        this.docClint = lib_dynamodb_1.DynamoDBDocumentClient.from(this.client);
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
    async getAllTodos(email) {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: "EcommerceSignup",
            Key: {
                email: email,
            },
        });
        const response = await this.docClint.send(command);
        console.log(response);
        return response;
    }
}
exports.TodoRepository = TodoRepository;
//# sourceMappingURL=todo-repository.js.map