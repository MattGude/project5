import { User } from '../types';

interface MockUser {
  id: string;
  email: string;
  password: string;
}

interface MockDb {
  users: MockUser[];
  listings: any[];
  sessions: { userId: string; token: string }[];
}

const db: MockDb = {
  users: [],
  listings: [],
  sessions: [],
};

export const mockAuth = {
  async signUp(email: string, password: string) {
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user: MockUser = {
      id: Math.random().toString(36).substring(2),
      email,
      password,
    };

    db.users.push(user);
    const token = Math.random().toString(36).substring(2);
    db.sessions.push({ userId: user.id, token });

    return { user: { id: user.id, email: user.email } as User, token };
  },

  async signIn(email: string, password: string) {
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = Math.random().toString(36).substring(2);
    db.sessions.push({ userId: user.id, token });

    return { user: { id: user.id, email: user.email } as User, token };
  },

  async signOut(token: string) {
    const sessionIndex = db.sessions.findIndex(s => s.token === token);
    if (sessionIndex > -1) {
      db.sessions.splice(sessionIndex, 1);
    }
  },

  async getSession(token: string) {
    const session = db.sessions.find(s => s.token === token);
    if (!session) return null;

    const user = db.users.find(u => u.id === session.userId);
    if (!user) return null;

    return { user: { id: user.id, email: user.email } as User };
  },
};

export const mockDb = {
  listings: {
    async getAll() {
      return db.listings;
    },

    async create(data: any) {
      const listing = {
        id: Math.random().toString(36).substring(2),
        ...data,
        created_at: new Date().toISOString(),
      };
      db.listings.push(listing);
      return listing;
    },

    async getByCategory(category: string, subcategory: string) {
      return db.listings.filter(
        l => l.category.toLowerCase() === category.toLowerCase() &&
        l.subcategory.toLowerCase() === subcategory.toLowerCase()
      );
    },

    async getByUser(userId: string) {
      return db.listings.filter(l => l.user_id === userId);
    },

    async update(id: string, userId: string, data: any) {
      const index = db.listings.findIndex(l => l.id === id && l.user_id === userId);
      if (index === -1) throw new Error('Listing not found');
      
      db.listings[index] = { ...db.listings[index], ...data };
      return db.listings[index];
    },

    async delete(id: string, userId: string) {
      const index = db.listings.findIndex(l => l.id === id && l.user_id === userId);
      if (index === -1) throw new Error('Listing not found');
      
      db.listings.splice(index, 1);
    },
  },
};