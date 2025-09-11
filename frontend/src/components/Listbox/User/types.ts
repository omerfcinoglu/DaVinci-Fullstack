import type { User, NewUser } from "@/domain/types";

export type UserItem = {
  user: User;
  avatar?: string;
};

export type GetColor = (
  userId: number
) => { bg: string; solid?: string } | undefined;

// Modal Types
export type ModalMode = "edit" | "create";
export type ModalState = "form" | "delete-confirmation";

export interface BaseModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export interface UserFormModalProps extends BaseModalProps {
  readonly mode: ModalMode;
  readonly user: User | null;
  readonly isLoading?: boolean;
  readonly error?: string | null;
  readonly onSave?: (
    id: number,
    patch: Omit<User, "id">
  ) => Promise<void> | void;
  readonly onCreate?: (input: NewUser) => Promise<void> | void;
}

export interface DeleteConfirmationModalProps extends BaseModalProps {
  readonly user: User;
  readonly onDelete: (id: number) => void;
}

export interface FormFieldProps {
  readonly label: string;
  readonly value: string;
  readonly type?: string;
  readonly error?: string;
  readonly onChange: (value: string) => void;
}
