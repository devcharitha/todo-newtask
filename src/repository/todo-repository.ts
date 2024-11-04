import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Taskdetails, TodoDetails } from "../model/todo-model";

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
                password: requestBody.password,
                tasks: requestBody.tasks
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
    async getUserTasks(userId: string): Promise<Taskdetails[]> {
        const command = new GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId,
            },
        });
        const response: any = await this.docClient.send(command);
        console.log(response);
        return response.Item.tasks as Taskdetails[];
    }

    async updateTask(userId: string, taskId: string, taskName: string, status: string): Promise<any> {
        const getCommand = new GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId
            }
        });
        const response: any = await this.docClient.send(getCommand);
        const tasks = response.Item.tasks;


        const taskToUpdate = tasks.find((task) => task.taskId === taskId);

        if (taskToUpdate) {
            taskToUpdate.taskName = taskName;
            taskToUpdate.status = status;

            const updateCommand = new UpdateCommand({
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
        } else {
            return { error: "Task not found" };
        }
    }

    async deleteTask(userId: string, taskId: string): Promise<any> {
        const getCommand = new GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId
            }
        });
        const response: any = await this.docClient.send(getCommand);
        const tasks = response.Item.tasks;

        const taskToDelete = tasks.find((task) => task.taskId === taskId);

        if (taskToDelete) {
            const updatedTasks = tasks.filter((task) => task.taskId !== taskId);

            const updateCommand = new UpdateCommand({
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
        } else {
            return { error: "Task not found" };
        }
    }

}
