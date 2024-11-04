export interface TodoDetails {
    userName: string;
    userId: string;
    password: string;
    tasks: Taskdetails[];
  }
  
  export interface User {
    userId: string;
    password: string;
  }
  
  export interface Taskdetails {
    taskId: string;
    taskName: string;
    status: string;
  }
  