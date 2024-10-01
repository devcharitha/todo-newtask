export interface TodoDetails {
    userName: string;
    userId: string;
    tasks: Taskdetails[];
}
export interface Taskdetails{
    taskId: string;
    taskName: string;
    status: string;
}