import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, ScanCommand, DynamoDBDocumentClient, UpdateCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { TodoDetails} from "../model/todo-model";

export class TodoRepository {
    private client: DynamoDBClient;
    private docClient: DynamoDBDocumentClient;

    constructor() {
        this.client = new DynamoDBClient({ region: "us-west-2" });
        this.docClient = DynamoDBDocumentClient.from(this.client);
    }

    async createUser(requestBody: TodoDetails): Promise<any> {
        const command = new PutCommand({
            TableName: "Todo",
            Item: {
                userName: requestBody.userName,
                userId: requestBody.userId,
                tasks:requestBody.tasks
            }
        });
        const response = await this.client.send(command);
        console.log(response);
        return response;
    }
    async loginUserByUserId(userId: string): Promise<TodoDetails> {
        const command = new GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId,
            },
        });
        const response: any = await this.docClient.send(command);
        console.log(response);
        return response;
    }
    async getUsers(): Promise<TodoDetails[]> {
        const command = new ScanCommand({
            TableName: "Todo",
        });
        const response: any = await this.docClient.send(command);
        console.log(response);
        return response.Items as TodoDetails[];
    }

    async updateTask(userId:string,taskId: string, taskName: string, status: string): Promise<any> {
        const command = new UpdateCommand({
            TableName: "Todo",
            Key: {
                userId:userId,
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

    async deleteTask(userId: string, taskId: string): Promise<any> {
        const command = new UpdateCommand({
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
