import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { UserTasks, TodoUserDetails, TaskDetails } from "../model/todo-model";
import { v4 as uuidv4 } from 'uuid';

export class TodoRepository {
    private client: DynamoDBClient;
    private docClient: DynamoDBDocumentClient;

    constructor() {
        this.client = new DynamoDBClient({ region: "us-west-2" });
        this.docClient = DynamoDBDocumentClient.from(this.client);
    }

    async createUser(requestBody: TodoUserDetails): Promise<any> {
        const command = new PutCommand({
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

    async loginUserByUserId(userId: string): Promise<TodoUserDetails> {
        const command = new GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId,
            },
        });
        const response: any = await this.docClient.send(command);
        console.log("Login User Response:", response);
        return response;
    }

    async createTask(userId: string, requestBody: TaskDetails): Promise<TaskDetails> {
        const command = new GetCommand({
            TableName: "Todo",
            Key: {
                userId: userId
            }
        });
        const response = await this.docClient.send(command);
        if (response.Item) {
            const newTask: TaskDetails = {
                taskId: uuidv4(),
                taskName: requestBody.taskName,
                status: requestBody.status
            };
            const existingTasks = response.Item.tasks || [];
            const updatedTasks = [...existingTasks, newTask];
            const command1 = new PutCommand({
                TableName: "Todo-task",
                Item: {
                    userId: response.Item.userId,
                    tasks: updatedTasks
                }
            });
            const res: any = await this.docClient.send(command1);
            console.log("Create Task Response:", res);
            return newTask;
        } else {
            throw new Error("User not found to create task");
        }
    }

    async getUserTasks(userId: string): Promise<TaskDetails[]> {
        const command = new GetCommand({
            TableName: "Todo-task",
            Key: {
                userId: userId
            }
        });
        const response = await this.docClient.send(command);
        console.log("Get User Tasks Response:", response);
        if (response.Item) {
            return response.Item.tasks || [];
        } else {
            throw new Error("User not found");
        }
    }

    async updateTask(userId: string, taskId: string, newStatus: string): Promise<TaskDetails> {
        const tasks = await this.getUserTasks(userId);

        const taskIndex = tasks.findIndex(task => task.taskId === taskId);
        if (taskIndex === -1) {
            throw new Error("Task not found");
        }
        tasks[taskIndex].status = newStatus;
        const command = new PutCommand({
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

    async deleteTask(userId: string, taskId: string): Promise<void> {
        const tasks = await this.getUserTasks(userId);
        const taskIndex = tasks.findIndex(task => task.taskId === taskId);
        if (taskIndex === -1) {
            throw new Error("Task not found");
        }
        const updatedTasks = tasks.filter(task => task.taskId !== taskId);
        const command = new PutCommand({
            TableName: "Todo-task",
            Item: {
                userId: userId,
                tasks: updatedTasks
            }
        });

        const response: any = await this.docClient.send(command);
        console.log("Delete Task Response:", response);
    }
}