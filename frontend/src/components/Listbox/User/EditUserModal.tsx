import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    Button,
    ModalFooter,
} from '@heroui/react';
import type { User, NewUser } from '@/domain/types';
import { UserFormModal } from './UserFormModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import type { ModalMode, ModalState } from './types';

interface Props {
    readonly isOpen: boolean;
    readonly mode?: ModalMode;
    readonly user: User | null;
    readonly isLoading?: boolean;
    readonly error?: string | null;
    readonly onClose: () => void;
    readonly onSave?: (id: number, patch: Omit<User, 'id'>) => Promise<void> | void;
    readonly onDelete?: (id: number) => Promise<void> | void;
    readonly onCreate?: (input: NewUser) => Promise<void> | void;
}

export const EditUserModal = React.memo<Props>(({
    isOpen,
    mode = 'edit',
    user,
    onClose,
    onSave,
    onDelete,
    onCreate,
    isLoading = false,
    error = null,
}) => {
    const [modalState, setModalState] = React.useState<ModalState>('form');

    // Reset modal state when modal opens/closes or mode changes
    React.useEffect(() => {
        if (isOpen) {
            setModalState('form');
        }
    }, [isOpen, mode]);

    const getModalTitle = (): string => {
        if (modalState === 'delete-confirmation') {
            return 'Delete User';
        }

        if (mode === 'create') {
            return 'Add User';
        }

        const userIdSuffix = user ? ` — #${user.id}` : '';
        return `Edit User${userIdSuffix}`;
    };

    const handleDeleteClick = (): void => {
        setModalState('delete-confirmation');
    };

    const handleCancelDelete = (): void => {
        setModalState('form');
    };

    const renderModalContent = (): React.ReactNode => {
        if (modalState === 'delete-confirmation' && user && onDelete) {
            return (
                <DeleteConfirmationModal
                    isOpen={isOpen}
                    user={user}
                    onDelete={onDelete}
                    onCancel={handleCancelDelete}
                    onClose={onClose}
                />
            );
        }

        return (
            <>
                <UserFormModal
                    isOpen={isOpen}
                    mode={mode}
                    user={user}
                    onSave={onSave}
                    onCreate={onCreate}
                    onClose={onClose}
                    isLoading={isLoading}
                    error={error}
                />

                {mode === 'edit' && onDelete && (
                    <ModalFooter className="pt-2">
                        <Button
                            color="danger"
                            variant="flat"
                            onPress={handleDeleteClick}
                            size="sm"
                        >
                            Delete User
                        </Button>
                    </ModalFooter>
                )}
            </>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            backdrop="blur"
            placement="center"
            size="md"
            classNames={{
                base: "bg-background",
                backdrop: "bg-black/50",
                header: "border-b border-divider",
                footer: "border-t border-divider",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col">
                            {getModalTitle()}
                        </ModalHeader>
                        {renderModalContent()}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
});

EditUserModal.displayName = 'EditUserModal';
