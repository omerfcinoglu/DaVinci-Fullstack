import { User } from "@/domain/types";

export type UserItem = {
  user: User;
  avatar?: string;
};

export type GetColor = (
  userId: number
) => { bg: string; solid?: string } | undefined;
