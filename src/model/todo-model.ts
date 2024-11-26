export interface TodoUserDetails {
  userName: string;
  userId: string;
  password: string;
}

export interface User {
  userId: string;
  password: string;
}

export interface TaskDetails {
  taskId: string;
  taskName: string;
  status: string;
}

export interface UserTasks {
  userId: string;
  tasks: TaskDetails[];
}