import { User, Post } from "../domain/types";

export interface UsersPort {
  list(): Promise<User[]>;
  // CRUD
}

export interface PostsPort {
  list(): Promise<Post[]>;
  // CRUD
}

export interface DataSource {
  users: UsersPort;
  posts: PostsPort;
}
