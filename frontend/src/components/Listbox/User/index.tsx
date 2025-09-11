import React from "react";
import { Listbox, ListboxItem, type Selection } from "@heroui/react";
import { ListboxWrapper } from "@/components/Listbox/ListboxWrapper";
import { EditUserModal } from "./EditUserModal";
import { SelectedChips } from "./SelectedChips";
import { UserRow } from "./UserRow";
import type { GetColor, UserItem } from "./types";

type Props = {
    readonly items: readonly UserItem[];
    readonly label?: string;
    readonly defaultSelectedKeys?: Iterable<string>;
    readonly getColor?: GetColor;
    readonly onSelectionChange?: (keys: Selection, selectedItems: UserItem[]) => void;
    readonly onSaveUser?: (id: number, patch: { name: string; username: string; email: string }) => void;
};

export function UserListbox({
    items,
    label = "Assigned to",
    defaultSelectedKeys = [],
    getColor,
    onSelectionChange,
    onSaveUser
}: Props) {
    const [selected, setSelected] = React.useState<Selection>(new Set(defaultSelectedKeys));
    const selectedKeys = React.useMemo<string[]>(() => {
        if (selected === "all") return items.map(i => String(i.user.id));
        return Array.from(selected).map(String);
    }, [selected, items]);

    const itemsById = React.useMemo(() => {
        const m = new Map<string, UserItem>();
        for (const it of items) m.set(String(it.user.id), it);
        return m;
    }, [items]);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingUserId, setEditingUserId] = React.useState<number | null>(null);
    const editingUser = React.useMemo(
        () => (editingUserId != null ? itemsById.get(String(editingUserId))?.user ?? null : null),
        [editingUserId, itemsById]
    );

    const openEdit = React.useCallback((userId: number) => {
        setEditingUserId(userId);
        setIsModalOpen(true);
    }, []);
    const closeEdit = React.useCallback(() => setIsModalOpen(false), []);

    const handleSelection = (keys: Selection) => {
        setSelected(keys);
        if (!onSelectionChange) return;
        const picked =
            keys === "all"
                ? Array.from(items)
                : items.filter((i) => (keys as Set<React.Key>).has(String(i.user.id)));
        onSelectionChange(keys, picked);
    };

    return (
        <ListboxWrapper>
            <Listbox
                items={items}
                label={label}
                selectionMode="multiple"
                selectedKeys={selected}
                variant="flat"
                topContent={
                    <SelectedChips
                        selectedKeys={selectedKeys}
                        itemsById={itemsById}
                        getColor={getColor}
                        onEdit={openEdit}
                    />
                }
                onSelectionChange={handleSelection}
            >
                {(it) => {
                    const isSelected = selectedKeys.includes(String(it.user.id));
                    const color = getColor?.(it.user.id);
                    const style = isSelected && color ? { backgroundColor: color.bg } : undefined;

                    return (
                        <ListboxItem key={it.user.id} textValue={it.user.name} style={style}>
                            <UserRow item={it} />
                        </ListboxItem>
                    );
                }}
            </Listbox>

            <EditUserModal
                isOpen={isModalOpen}
                user={editingUser}
                onClose={closeEdit}
                onSave={onSaveUser ?? ((id, patch) => console.log("Save user (default):", { id, ...patch }))}
            />
        </ListboxWrapper>
    );
}

export * from "./types";
