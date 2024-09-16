import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, DeleteCommand, UpdateCommand,DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { TodoDetails } from "../model/todo-model";


export class TodoRepository {
    private client: DynamoDBClient;
    private docClint: DynamoDBDocumentClient;

    constructor() {
        this.client = new DynamoDBClient({ region: "us-west-2" });
        this.docClint = DynamoDBDocumentClient.from(this.client);
    }
    async createTask(requestBody:TodoDetails): Promise<any> {
        const command = new PutCommand({
            TableName: "EcommerceSignup",
            Item: {
                taskName: requestBody.taskName,
                status:requestBody.status
            }
        });
        const response = await this.client.send(command);
        console.log(response);
        return response;
    }
    async getAllTodos(email: string): Promise<TodoDetails> {
        const command = new GetCommand({
            TableName: "EcommerceSignup",
            Key: {
                email: email,
            },
        });
        const response: any = await this.docClint.send(command);
        console.log(response);
        return response;
    }
    }