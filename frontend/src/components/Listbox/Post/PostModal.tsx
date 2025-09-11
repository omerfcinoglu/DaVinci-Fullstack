import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    Button,
    ModalFooter,
} from '@heroui/react';
import type { Post, NewPost } from '@/domain/types';
import { PostFormModal } from './PostFormModal';
import { DeletePostConfirmationModal } from './DeletePostConfirmationModal';
import type { PostModalMode, PostModalState } from './types';

interface Props {
    readonly isOpen: boolean;
    readonly mode?: PostModalMode;
    readonly post: Post | null;
    readonly availableUsers?: Array<{ id: number; name: string }>;
    readonly isLoading?: boolean;
    readonly error?: string | null;
    readonly onClose: () => void;
    readonly onSave?: (id: number, patch: Omit<Post, 'id'>) => Promise<void> | void;
    readonly onDelete?: (id: number) => Promise<void> | void;
    readonly onCreate?: (input: NewPost) => Promise<void> | void;
}

export const PostModal = React.memo<Props>(({
    isOpen,
    mode = 'edit',
    post,
    availableUsers = [],
    onClose,
    onSave,
    onDelete,
    onCreate,
    isLoading = false,
    error = null,
}) => {
    const [modalState, setModalState] = React.useState<PostModalState>('form');

    // Reset modal state when modal opens/closes or mode changes
    React.useEffect(() => {
        if (isOpen) {
            setModalState('form');
        }
    }, [isOpen, mode]);

    const getModalTitle = (): string => {
        if (modalState === 'delete-confirmation') {
            return 'Delete Post';
        }

        if (mode === 'create') {
            return 'Create New Post';
        }

        const postIdSuffix = post ? ` — #${post.id}` : '';
        return `Edit Post${postIdSuffix}`;
    };

    const handleDeleteClick = (): void => {
        setModalState('delete-confirmation');
    };

    const handleCancelDelete = (): void => {
        setModalState('form');
    };

    const renderModalContent = (): React.ReactNode => {
        if (modalState === 'delete-confirmation' && post && onDelete) {
            return (
                <DeletePostConfirmationModal
                    isOpen={isOpen}
                    post={post}
                    onDelete={onDelete}
                    onCancel={handleCancelDelete}
                    onClose={onClose}
                />
            );
        }

        return (
            <>
                <PostFormModal
                    isOpen={isOpen}
                    mode={mode}
                    post={post}
                    availableUsers={availableUsers}
                    onSave={onSave}
                    onCreate={onCreate}
                    onClose={onClose}
                    isLoading={isLoading}
                    error={error}
                />

                {mode === 'edit' && onDelete && (
                    <ModalFooter className="pt-0">
                        <Button
                            color="danger"
                            variant="flat"
                            onPress={handleDeleteClick}
                            size="sm"
                        >
                            Delete Post
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
            size="lg"
            scrollBehavior="inside"
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

PostModal.displayName = 'PostModal';
