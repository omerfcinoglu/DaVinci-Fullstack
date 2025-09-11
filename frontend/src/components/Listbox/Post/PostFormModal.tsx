import React from 'react';
import { Button, ModalBody, ModalFooter } from '@heroui/react';
import { PostFormField } from './PostFormField';
import { UserSelect } from './UserSelect';
import { usePostForm } from '@/hooks/usePostForm';
import type { PostFormModalProps } from './types';

export const PostFormModal = React.memo<PostFormModalProps>(({
    mode,
    post,
    availableUsers = [],
    onSave,
    onCreate,
    onClose,
    isLoading = false,
    error = null
}) => {
    const {
        form,
        updateField,
        isFormValid,
        validationErrors,
        validateAllFields
    } = usePostForm({ mode, post, availableUsers });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (): Promise<void> => {
        // Validate all fields before submission
        const isValid = validateAllFields();
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const postData = {
                title: form.title.trim(),
                body: form.body.trim(),
                userId: Number(form.userId)
            };

            if (mode === 'create') {
                await onCreate?.(postData);
            } else if (mode === 'edit' && post) {
                await onSave?.(post.id, postData);
            }

            onClose();
        } catch (error) {
            console.error('Failed to submit post form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitButtonText = mode === 'create' ? 'Create Post' : 'Save Changes';
    const isSubmitDisabled = !isFormValid || isLoading || isSubmitting;

    return (
        <>
            <ModalBody className="space-y-4">
                {error && (
                    <div className="p-3 bg-danger-50 border border-danger-200 rounded-md">
                        <p className="text-sm text-danger-700">{error}</p>
                    </div>
                )}

                <PostFormField
                    label="Title"
                    value={form.title}
                    error={validationErrors.title}
                    placeholder="Enter post title..."
                    onChange={(value) => updateField('title', value)}
                />

                <PostFormField
                    label="Body"
                    value={form.body}
                    error={validationErrors.body}
                    isTextArea={true}
                    placeholder="Write your post content here..."
                    onChange={(value) => updateField('body', value)}
                />

                <UserSelect
                    label="Author"
                    selectedUserId={form.userId ? Number(form.userId) : undefined}
                    availableUsers={availableUsers}
                    error={validationErrors.userId}
                    onChange={(userId) => updateField('userId', String(userId))}
                />
            </ModalBody>

            <ModalFooter>
                <Button
                    variant="flat"
                    onPress={onClose}
                    isDisabled={isSubmitting}
                >
                    Cancel
                </Button>

                <Button
                    color="primary"
                    onPress={handleSubmit}
                    isDisabled={isSubmitDisabled}
                    isLoading={isSubmitting}
                >
                    {submitButtonText}
                </Button>
            </ModalFooter>
        </>
    );
});

PostFormModal.displayName = 'PostFormModal';
