export interface ListTodo {
    status: "completed" | "on-track" | '', 
    title:string, 
    description:string, 
    created_at:string, 
    completed:string, 
    id_todo:string
}

export interface Todo {
    id_todo:string,
    id_user:string,
    title:string, 
    status:string, 
    description:string, 
    created_at:string, 
    updated_at: string,
    completed:string, 
}