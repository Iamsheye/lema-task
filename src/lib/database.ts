import { join } from "node:path";
import Database from "better-sqlite3";

const dbPath = join(process.cwd(), "data.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface Address {
  id: string;
  user_id: string;
  street: string;
  state: string;
  city: string;
  zipcode: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
}

export class DatabaseService {
  static getPostsByUserId(userId: string): Array<Post> {
    const stmt = db.prepare(
      "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC",
    );
    return stmt.all(userId) as Array<Post>;
  }

  static deletePost(postId: string): boolean {
    const stmt = db.prepare("DELETE FROM posts WHERE id = ?");
    const result = stmt.run(postId);
    return result.changes > 0;
  }

  static postExists(postId: string): boolean {
    const stmt = db.prepare("SELECT 1 FROM posts WHERE id = ?");
    return stmt.get(postId) !== undefined;
  }

  static getUserById(userId: string): User | undefined {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(userId) as User | undefined;
  }

  static getUsersWithAddresses(
    limit = 10,
    offset = 0,
  ): { users: Array<User & { address?: Address }>; total: number } {
    const countStmt = db.prepare("SELECT COUNT(*) as count FROM users");
    const total = (countStmt.get() as { count: number }).count;

    const stmt = db.prepare(`
      SELECT 
        u.*,
        a.id as address_id,
        a.street,
        a.state,
        a.city,
        a.zipcode
      FROM users u
      LEFT JOIN addresses a ON u.id = a.user_id
      LIMIT ? OFFSET ?
    `);

    const rows = stmt.all(limit, offset) as Array<
      User & {
        address_id?: string;
        street?: string;
        state?: string;
        city?: string;
        zipcode?: string;
      }
    >;

    const users = rows.map((row) => {
      const { address_id, street, state, city, zipcode, ...user } = row;
      return {
        ...user,
        address: address_id
          ? {
              id: address_id,
              user_id: user.id,
              street: street!,
              state: state!,
              city: city!,
              zipcode: zipcode!,
            }
          : undefined,
      };
    });

    return { users: users.sort((a, b) => a.name.localeCompare(b.name)), total };
  }

  static createPost(data: {
    userId: string;
    title: string;
    body: string;
  }): Post {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO posts (id, user_id, title, body, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, data.userId, data.title, data.body, createdAt);

    return {
      id,
      user_id: data.userId,
      title: data.title,
      body: data.body,
      created_at: createdAt,
    };
  }
}

export default db;
