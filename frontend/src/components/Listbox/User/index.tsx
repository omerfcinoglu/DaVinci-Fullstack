import React from "react";
import { Listbox, ListboxItem, type Selection } from "@heroui/react";
import { ListboxWrapper } from "@/components/Listbox/ListboxWrapper";
import { EditUserModal } from "./EditUserModal";
import { SelectedChips } from "./SelectedChips";
import { UserRow } from "./UserRow";
import type { GetColor, UserItem } from "./types";
import type { NewUser } from "@/domain/types";
import { PlusIcon } from "lucide-react";

type Props = {
    readonly items: readonly UserItem[];
    readonly label?: string;
    readonly defaultSelectedKeys?: Iterable<string>;
    readonly getColor?: GetColor;
    readonly onSelectionChange?: (keys: Selection, selectedItems: UserItem[]) => void;
    readonly onSaveUser?: (id: number, patch: { name: string; username: string; email: string }) => void;
    readonly onDeleteUser?: (id: number) => void;
    readonly onCreateUser?: (input: NewUser) => void;
};

export function UserListbox({
    items, label = "Assigned to", defaultSelectedKeys = [],
    getColor, onSelectionChange, onSaveUser, onDeleteUser, onCreateUser
}: Props) {
    const [selected, setSelected] = React.useState<Selection>(new Set(defaultSelectedKeys));
    const selectedKeys = React.useMemo<string[]>(
        () => (selected === "all" ? items.map(i => String(i.user.id)) : Array.from(selected).map(String)),
        [selected, items]
    );
    const itemsById = React.useMemo(() => {
        const m = new Map<string, UserItem>();
        for (const it of items) m.set(String(it.user.id), it);
        return m;
    }, [items]);

    const [isOpen, setIsOpen] = React.useState(false);
    const [mode, setMode] = React.useState<"edit" | "create">("edit");
    const [editingUserId, setEditingUserId] = React.useState<number | null>(null);
    const editingUser = React.useMemo(
        () => (mode === "edit" && editingUserId != null ? itemsById.get(String(editingUserId))?.user ?? null : null),
        [mode, editingUserId, itemsById]
    );

    const openEdit = (userId: number) => { setMode("edit"); setEditingUserId(userId); setIsOpen(true); };
    const closeModal = () => setIsOpen(false);

    const handleSelection = (keys: Selection) => {
        setSelected(keys);
        if (!onSelectionChange) return;
        const picked = keys === "all"
            ? Array.from(items)
            : items.filter((i) => (keys as Set<React.Key>).has(String(i.user.id)));
        onSelectionChange(keys, picked);
    };

    const handleDeleteFromModal = (id: number) => {
        onDeleteUser?.(id);
        setSelected(prev => prev === "all" ? new Set() : new Set(Array.from(prev).filter(k => k !== String(id))));
        setIsOpen(false);
    };

    return (
        <ListboxWrapper>
            <Listbox
                classNames={{ list: "max-h-[600px] overflow-y-scroll" }}
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
                bottomContent={
                    <div className="sticky bottom-0 z-10 -mb-2 bg-background/60 backdrop-blur p-2 flex justify-center">
                        <button
                            type="button"
                            aria-label="Add user"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
                            onClick={() => { setMode("create"); setEditingUserId(null); setIsOpen(true); }}
                        >
                            <PlusIcon size={16} />
                        </button>
                    </div>
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
                isOpen={isOpen}
                mode={mode}
                user={editingUser}
                onClose={closeModal}
                onSave={onSaveUser ?? ((id, patch) => console.log("Save user (default):", { id, ...patch }))}
                onDelete={handleDeleteFromModal}
                onCreate={(input) => {
                    onCreateUser?.(input);
                    setIsOpen(false);
                }}
            />
        </ListboxWrapper>
    );
}

export * from "./types";
