import React from "react";
import {
    Listbox,
    ListboxItem,
    Chip,
    ScrollShadow,
    Avatar,
    type Selection,
} from "@heroui/react";
import { ListboxWrapper } from "./ListboxWrapper";

export type UserItem = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
};

type Props = {
    readonly items: readonly UserItem[];
    readonly label?: string;
    readonly defaultSelectedKeys?: Iterable<string>;
    readonly onSelectionChange?: (keys: Selection, selectedItems: UserItem[]) => void;
};

export function UserListbox({
    items,
    label = "Assigned to",
    defaultSelectedKeys = [],
    onSelectionChange,
}: Props) {
    const [selected, setSelected] = React.useState<Selection>(
        new Set(defaultSelectedKeys)
    );

    const selectedIds = React.useMemo(() => {
        if (selected === "all") return items.map((i) => String(i.id));
        return Array.from(selected).map(String);
    }, [selected, items]);

    const topContent = React.useMemo(() => {
        if (!selectedIds.length) return null;
        return (
            <ScrollShadow
                hideScrollBar
                className="w-full flex py-0.5 px-2 gap-1"
                orientation="horizontal"
            >
                {selectedIds.map((key) => {
                    const u = items.find((x) => String(x.id) === key);
                    return <Chip key={key}>{u?.name ?? "Unknown"}</Chip>;
                })}
            </ScrollShadow>
        );
    }, [selectedIds, items]);

    return (
        <ListboxWrapper>
            <Listbox
                items={items}
                label={label}
                selectionMode="multiple"
                selectedKeys={selected}
                topContent={topContent}
                variant="flat"
                onSelectionChange={(keys) => {
                    setSelected(keys);
                    if (onSelectionChange) {
                        const picked =
                            keys === "all"
                                ? Array.from(items)
                                : items.filter((i) => (keys as Set<React.Key>).has(String(i.id)));
                        onSelectionChange(keys, picked);
                    }
                }}
            >
                {(item) => (
                    <ListboxItem key={item.id} textValue={item.name}>
                        <div className="flex gap-2 items-center">
                            <Avatar
                                alt={item.name}
                                className="shrink-0"
                                size="sm"
                                name={item.name}
                                src={item.avatar}
                            />
                            <div className="flex flex-col">
                                <span className="text-small">{item.name}</span>
                                <span className="text-tiny text-default-400">{item.email}</span>
                            </div>
                        </div>
                    </ListboxItem>
                )}
            </Listbox>
        </ListboxWrapper>
    );
}
