import React from 'react';
import { Input } from '@heroui/react';
import type { FormFieldProps } from './types';

export const FormField = React.memo<FormFieldProps>(({
    label,
    value,
    type = 'text',
    error,
    onChange
}) => (
    <Input
        label={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        isInvalid={!!error}
        errorMessage={error}
        variant="bordered"
    />
));

FormField.displayName = 'FormField';
