import React from 'react';
import { Button, ModalFooter } from '@heroui/react';
import type { DeleteConfirmationModalProps } from './types';

interface Props extends DeleteConfirmationModalProps {
    readonly onCancel: () => void;
}

export const DeleteConfirmationModal = React.memo<Props>(({
    user,
    onDelete,
    onCancel,
    onClose
}) => {
    const handleDelete = (): void => {
        onDelete(user.id);
        onClose();
    };

    return (
        <>
            <div className="px-6 py-4">
                <p className="text-danger font-medium">
                    Are you sure you want to delete user "{user.name}"?
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

DeleteConfirmationModal.displayName = 'DeleteConfirmationModal';
