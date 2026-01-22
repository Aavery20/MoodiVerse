
import { MoodLog } from "../types";

const DB_KEY = 'moodiverse_database_v1';

/**
 * dbService simulates a real-world backend API.
 * In a production environment, these methods would call a REST/GraphQL endpoint.
 */
export const dbService = {
  /**
   * Fetches all logs from the database
   */
  async getLogs(): Promise<MoodLog[]> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 600));
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Database fetch error:", e);
      return [];
    }
  },

  /**
   * Persists a new log entry
   */
  async saveLog(log: MoodLog): Promise<boolean> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const logs = await this.getLogs();
      const updated = [...logs, log];
      localStorage.setItem(DB_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error("Database save error:", e);
      return false;
    }
  },

  /**
   * Clears the entire database
   */
  async clearDatabase(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem(DB_KEY);
  }
};
