import { getDbConnection } from "./database.service";

export const authService = {
  async register(name: string, email: string, password: string) {
    const db = await getDbConnection();
    try {
      // Periksa apakah email sudah digunakan
      const existingUser = await db.getFirstAsync<{id: number}>('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUser) {
        throw new Error("Email already registered!");
      }
      
      const result = await db.runAsync(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
      
      return { id: result.lastInsertRowId, name, email };
    } catch (error) {
      throw error;
    }
  },

  async login(email: string, password: string) {
    const db = await getDbConnection();
    try {
      const user = await db.getFirstAsync<{id: number, name: string, email: string}>(
        'SELECT id, name, email FROM users WHERE email = ? AND password = ?',
        [email, password]
      );
      if (!user) {
        throw new Error("Invalid email or password");
      }
      // Mengembalikan id sebagai 'token' mock
      return { token: user.id.toString(), user };
    } catch (error) {
      throw error;
    }
  },

  async getProfile(userId: string | number) {
    const db = await getDbConnection();
    try {
      const user = await db.getFirstAsync<{id: number, name: string, email: string}>(
        'SELECT id, name, email FROM users WHERE id = ?',
        [typeof userId === 'string' ? parseInt(userId) : userId]
      );
      if (!user) {
        throw new Error("User not found");
      }
      return { status: 200, response: { data: user } };
    } catch (error) {
      throw error;
    }
  },

  async changePassword(userId: string | number, currentPass: string, newPass: string) {
    const db = await getDbConnection();
    try {
      // Check current password
      const user = await db.getFirstAsync('SELECT id FROM users WHERE id = ? AND password = ?', [typeof userId === 'string' ? parseInt(userId) : userId, currentPass]);
      if (!user) throw new Error("Incorrect current password");
      
      await db.runAsync('UPDATE users SET password = ? WHERE id = ?', [newPass, typeof userId === 'string' ? parseInt(userId) : userId]);
      return { status: 200, message: "Password changed successfully" };
    } catch (error) {
      throw error;
    }
  },

  async forgotPassword(email: string) {
    // Mock sending OTP
    return { status: 200, message: "OTP sent" };
  },

  async verifyOtp(email: string, otp: string) {
    // Mock verify OTP
    if (otp !== '1234') {
      // you can type 1234 to pass, or we just allow anything
    }
    return { status: 200, message: "OTP verified" };
  },

  async resetPassword(email: string, newPass: string) {
    const db = await getDbConnection();
    try {
      await db.runAsync('UPDATE users SET password = ? WHERE email = ?', [newPass, email]);
      return { status: 200, message: "Password reset successfully" };
    } catch (error) {
      throw error;
    }
  }
};
