import type { User, Post } from "@/domain/types";

const NS = "davinci";
const USERS_KEY = `${NS}.users.v1`;
const POSTS_KEY = `${NS}.posts.v1`;

const isBrowser = typeof window !== "undefined" && !!window.localStorage;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadUsersFromLS(): User[] {
  if (!isBrowser) return [];
  return safeParse<User[]>(localStorage.getItem(USERS_KEY)) ?? [];
}

export function saveUsersToLS(items: User[]) {
  if (!isBrowser) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(items));
}

export function loadPostsFromLS(): Post[] {
  if (!isBrowser) return [];
  return safeParse<Post[]>(localStorage.getItem(POSTS_KEY)) ?? [];
}

export function savePostsToLS(items: Post[]) {
  if (!isBrowser) return;
  localStorage.setItem(POSTS_KEY, JSON.stringify(items));
}

export function clearPersistedData() {
  if (!isBrowser) return;
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(POSTS_KEY);
}
