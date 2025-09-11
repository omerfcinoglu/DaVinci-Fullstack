import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export type Post = { userId: number; id: number; title: string; body?: string };

export type NewUser = Omit<User, "id">;
export type UpdateUser = Partial<Omit<User, "id">>;

export type NewPost = Omit<Post, "id">;
export type UpdatePost = Partial<Omit<Post, "id">>;
