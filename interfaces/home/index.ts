export interface ListTodo {
    status: "completed" | "on-track" | '', 
    title:string, 
    description:string, 
    created_at:string, 
    completed:string, 
    id_todo:string
}

export interface ListTodoDelete {
    id_todo:string,
    title:string, 
    description:string, 
    status: "completed" | "on-track" | '', 
    completed:string,
    created_at:string, 
    updated_at: string,
    deleted_at: string,
}

export interface TodoDetail {
    id_todo?:string,
    id_user?:string,
    title?:string, 
    status?:string,
    description?:string, 
    date?: string,
    image?: string,
    created_at?:string, 
    updated_at?: string,
    completed?:string, 
}