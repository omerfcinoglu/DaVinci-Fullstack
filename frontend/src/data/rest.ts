import { DataSource, UsersPort, PostsPort } from "./ports";
import { User, Post } from "../domain/types";

const BASE = "https://jsonplaceholder.typicode.com";

class RestUsers implements UsersPort {
  async list(): Promise<User[]> {
    const res = await fetch(`${BASE}/users`);
    if (!res.ok) throw new Error("Failed to load users");
    const data = (await res.json()) as User[];
    return data.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
    }));
  }
}

class RestPosts implements PostsPort {
  async list(): Promise<Post[]> {
    const res = await fetch(`${BASE}/posts`);
    if (!res.ok) throw new Error("Failed to load posts");
    const data = (await res.json()) as Post[];
    return data.map((p) => ({
      userId: p.userId,
      id: p.id,
      title: p.title,
      body: p.body,
    }));
  }
}

export const restDataSource: DataSource = {
  users: new RestUsers(),
  posts: new RestPosts(),
};
