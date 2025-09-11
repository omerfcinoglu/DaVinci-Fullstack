import React from 'react';
import { Select, SelectItem } from '@heroui/react';
import type { UserSelectProps } from './types';

export const UserSelect = React.memo<UserSelectProps>(({
    label,
    selectedUserId,
    availableUsers,
    error,
    onChange
}) => {
    return (
        <Select
            label={label}
            selectedKeys={selectedUserId ? [String(selectedUserId)] : []}
            onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                if (selectedKey) {
                    onChange(Number(selectedKey));
                }
            }}
            isInvalid={!!error}
            errorMessage={error}
            variant="bordered"
            placeholder="Select a user"
        >
            {availableUsers.map((user) => (
                <SelectItem key={user.id}>
                    {user.name}
                </SelectItem>
            ))}
        </Select>
    );
});

UserSelect.displayName = 'UserSelect';
