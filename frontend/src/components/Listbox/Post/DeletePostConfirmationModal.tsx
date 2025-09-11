import React from 'react';
import { Button, ModalFooter } from '@heroui/react';
import type { DeletePostConfirmationModalProps } from './types';

interface Props extends DeletePostConfirmationModalProps {
    readonly onCancel: () => void;
}

export const DeletePostConfirmationModal = React.memo<Props>(({
    post,
    onDelete,
    onCancel,
    onClose
}) => {
    const handleDelete = (): void => {
        onDelete(post.id);
        onClose();
    };

    return (
        <>
            <div className="px-6 py-4">
                <p className="text-danger font-medium">
                    Are you sure you want to delete this post?
                </p>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                    "{post.title}"
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone.
                </p>
            </div>

            <ModalFooter>
                <Button variant="flat" onPress={onCancel}>
                    Cancel
                </Button>
                <Button color="danger" onPress={handleDelete}>
                    Yes, delete
                </Button>
            </ModalFooter>
        </>
    );
});

DeletePostConfirmationModal.displayName = 'DeletePostConfirmationModal';
