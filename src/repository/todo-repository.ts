import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, ScanCommand, DynamoDBDocumentClient, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { TodoDetails } from "../model/todo-model";

export class TodoRepository {
    private client: DynamoDBClient;
    private docClient: DynamoDBDocumentClient;

    constructor() {
        this.client = new DynamoDBClient({ region: "us-west-2" });
        this.docClient = DynamoDBDocumentClient.from(this.client);
    }

    async createTask(requestBody: TodoDetails): Promise<any> {
        const command = new PutCommand({
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

    async getAllTasks(): Promise<TodoDetails[]> {
        const command = new ScanCommand({
            TableName: "EcommerceSignup",
        });
        const response: any = await this.docClient.send(command);
        console.log(response);
        return response.Items as TodoDetails[];
    }

    async updateTask(taskId: string, taskName: string, status: string): Promise<any> {
        const command = new UpdateCommand({
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

    async deleteTask(taskId: string): Promise<any> {
        const command = new DeleteCommand({
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
