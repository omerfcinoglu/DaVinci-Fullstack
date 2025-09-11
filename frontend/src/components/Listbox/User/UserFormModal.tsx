import React from 'react';
import { Button, ModalBody, ModalFooter } from '@heroui/react';
import { FormField } from './FormField';
import { useUserForm } from '@/hooks/useUserForm';
import type { UserFormModalProps } from './types';

export const UserFormModal = React.memo<UserFormModalProps>(({
    mode,
    user,
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
    } = useUserForm({ mode, user });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (): Promise<void> => {
        const isValid = validateAllFields();
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const userData = {
                name: form.name.trim(),
                username: form.username.trim(),
                email: form.email.trim()
            };

            if (mode === 'create') {
                await onCreate?.(userData);
            } else if (mode === 'edit' && user) {
                await onSave?.(user.id, userData);
            }

            onClose();
        } catch (error) {
            console.error('Failed to submit form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitButtonText = mode === 'create' ? 'Create User' : 'Save Changes';
    const isSubmitDisabled = !isFormValid || isLoading || isSubmitting;

    return (
        <>
            <ModalBody className="space-y-1">
                {error && (
                    <div className="p-3 bg-danger-50 border border-danger-200 rounded-md">
                        <p className="text-sm text-danger-700">{error}</p>
                    </div>
                )}

                <FormField
                    label="Name"
                    value={form.name}
                    error={validationErrors.name}
                    onChange={(value) => updateField('name', value)}
                />

                <FormField
                    label="Username"
                    value={form.username}
                    error={validationErrors.username}
                    onChange={(value) => updateField('username', value)}
                />

                <FormField
                    label="Email"
                    type="email"
                    value={form.email}
                    error={validationErrors.email}
                    onChange={(value) => updateField('email', value)}
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

UserFormModal.displayName = 'UserFormModal';
