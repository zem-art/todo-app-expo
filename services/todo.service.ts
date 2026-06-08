import { getDbConnection } from "./database.service";

export const todoService = {
  async getTodos(userId: string | number, page: number = 1, limit: number = 10) {
    const db = await getDbConnection();
    const offset = (page - 1) * limit;
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM todos WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [typeof userId === 'string' ? parseInt(userId) : userId, limit, offset]
      );
      return { status: 200, response: { data: result } };
    } catch (error) {
      throw error;
    }
  },

  async getTodoDetail(todoId: string | number) {
    const db = await getDbConnection();
    try {
      const result = await db.getFirstAsync(
        'SELECT * FROM todos WHERE id_todo = ?',
        [todoId]
      );
      return { status: 200, response: { data: result } };
    } catch (error) {
      throw error;
    }
  },

  async createTodo(userId: string | number, data: { title: string, description: string, status?: string }) {
    const db = await getDbConnection();
    try {
      const result = await db.runAsync(
        'INSERT INTO todos (user_id, title, description, status) VALUES (?, ?, ?, ?)',
        [typeof userId === 'string' ? parseInt(userId) : userId, data.title, data.description, data.status || 'open']
      );
      return { status: 201, message: "Success", response: { data: result } };
    } catch (error) {
      throw error;
    }
  },

  async updateTodo(todoId: string | number, data: { title: string, description: string, status?: string }) {
    const db = await getDbConnection();
    try {
      const result = await db.runAsync(
        'UPDATE todos SET title = ?, description = ?, status = ? WHERE id_todo = ?',
        [data.title, data.description, data.status ?? null, todoId]
      );
      return { status: 200, message: "Success", response: { data: result } };
    } catch (error) {
      throw error;
    }
  },

  async deleteTodo(todoId: string | number) {
    const db = await getDbConnection();
    try {
      const result = await db.runAsync(
        'UPDATE todos SET deleted_at = CURRENT_TIMESTAMP WHERE id_todo = ?',
        [todoId]
      );
      return { status: 200, message: "Deleted successfully" };
    } catch (error) {
      throw error;
    }
  },

  async getDeletedTodos(userId: string | number, page: number = 1, limit: number = 10) {
    const db = await getDbConnection();
    const offset = (page - 1) * limit;
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM todos WHERE user_id = ? AND deleted_at IS NOT NULL ORDER BY deleted_at DESC LIMIT ? OFFSET ?',
        [typeof userId === 'string' ? parseInt(userId) : userId, limit, offset]
      );
      return { status: 200, response: { data: result } };
    } catch (error) {
      throw error;
    }
  },

  async restoreTodo(todoId: string | number) {
    const db = await getDbConnection();
    try {
      const result = await db.runAsync(
        'UPDATE todos SET deleted_at = NULL WHERE id_todo = ?',
        [todoId]
      );
      return { status: 200, message: "Restored successfully" };
    } catch (error) {
      throw error;
    }
  }
};
