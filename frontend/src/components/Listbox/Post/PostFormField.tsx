import React from 'react';
import { Input, Textarea } from '@heroui/react';
import type { PostFormFieldProps } from './types';

export const PostFormField = React.memo<PostFormFieldProps>(({
    label,
    value,
    type = 'text',
    error,
    isTextArea = false,
    placeholder,
    onChange
}) => {
    if (isTextArea) {
        return (
            <Textarea
                label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                isInvalid={!!error}
                errorMessage={error}
                variant="bordered"
                placeholder={placeholder}
                minRows={3}
                maxRows={8}
            />
        );
    }

    return (
        <Input
            label={label}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            isInvalid={!!error}
            errorMessage={error}
            variant="bordered"
            placeholder={placeholder}
        />
    );
});

PostFormField.displayName = 'PostFormField';
