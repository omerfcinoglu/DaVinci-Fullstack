import type { NewPost, Post } from "@/domain/types";

export type PostItem = {
  post: Post;
  userInfo?: {
    name: string;
    username: string;
  };
};

export type GetPostColor = (
  postId: number
) => { bg: string; solid?: string } | undefined;

// Modal Types
export type PostModalMode = "edit" | "create";
export type PostModalState = "form" | "delete-confirmation";

export interface BasePostModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export interface PostFormModalProps extends BasePostModalProps {
  readonly mode: PostModalMode;
  readonly post: Post | null;
  readonly availableUsers?: Array<{ id: number; name: string }>;
  readonly isLoading?: boolean;
  readonly error?: string | null;
  readonly onSave?: (
    id: number,
    patch: Omit<Post, "id">
  ) => Promise<void> | void;
  readonly onCreate?: (input: NewPost) => Promise<void> | void;
}

export interface DeletePostConfirmationModalProps extends BasePostModalProps {
  readonly post: Post;
  readonly onDelete: (id: number) => void;
}

export interface PostFormFieldProps {
  readonly label: string;
  readonly value: string;
  readonly type?: string;
  readonly error?: string;
  readonly isTextArea?: boolean;
  readonly placeholder?: string;
  readonly onChange: (value: string) => void;
}

export interface UserSelectProps {
  readonly label: string;
  readonly selectedUserId?: number;
  readonly availableUsers: Array<{ id: number; name: string }>;
  readonly error?: string;
  readonly onChange: (userId: number) => void;
}
