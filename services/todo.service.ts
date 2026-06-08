import { getDbConnection } from "./database.service";

export const todoService = {
  async getTodos(userId, page = 1, limit = 10) {
    const db = await getDbConnection();
    const offset = (page - 1) * limit;
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [parseInt(userId), limit, offset]
      );
      return { status: 200, response: { data: result } };
    } catch (error) {
      throw error;
    }
  },

  async getTodoDetail(todoId) {
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

  async createTodo(userId, data) {
    const db = await getDbConnection();
    try {
      const result = await db.runAsync(
        'INSERT INTO todos (user_id, title, description, status) VALUES (?, ?, ?, ?)',
        [parseInt(userId), data.title, data.description, data.status || 'open']
      );
      return { status: 201, message: "Success", response: { data: result } };
    } catch (error) {
      throw error;
    }
  },

  async updateTodo(todoId, data) {
    const db = await getDbConnection();
    try {
      const result = await db.runAsync(
        'UPDATE todos SET title = ?, description = ?, status = ? WHERE id_todo = ?',
        [data.title, data.description, data.status, todoId]
      );
      return { status: 200, message: "Success", response: { data: result } };
    } catch (error) {
      throw error;
    }
  },

  async deleteTodo(todoId) {
    const db = await getDbConnection();
    try {
      const result = await db.runAsync(
        'DELETE FROM todos WHERE id_todo = ?',
        [todoId]
      );
      return { status: 200, message: "Deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
};
