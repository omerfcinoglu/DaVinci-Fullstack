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
import { User } from "@/domain/types";

export type UserItem = {
    user: User;
    avatar?: string;
};

type Props = {
    readonly items: readonly UserItem[];
    readonly label?: string;
    readonly defaultSelectedKeys?: Iterable<string>;
    readonly onSelectionChange?: (keys: Selection, selectedItems: UserItem[]) => void;
    readonly getColor?: (userId: number) => { bg: string; solid?: string };
};

export function UserListbox({
    items,
    label = "Assigned to",
    defaultSelectedKeys = [],
    onSelectionChange,
    getColor,
}: Props) {
    const [selected, setSelected] = React.useState<Selection>(
        new Set(defaultSelectedKeys)
    );

    const selectedIds = React.useMemo(() => {
        if (selected === "all") return items.map((i) => String(i.user.id));
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
                    const u = items.find((x) => String(x.user.id) === key);
                    const color = u && getColor ? getColor(u.user.id) : undefined;
                    return (
                        <Chip
                            key={key}
                            className="border-0"
                            style={color ? { backgroundColor: color.bg } : undefined}
                        >
                            {u?.user.name ?? "Unknown"}
                        </Chip>
                    );
                })}
            </ScrollShadow>
        );
    }, [selectedIds, items, getColor]);

    const isSelectedId = React.useCallback(
        (id: number) => selectedIds.includes(String(id)),
        [selectedIds]
    );

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
                                : items.filter((i) => (keys as Set<React.Key>).has(String(i.user.id)));
                        onSelectionChange(keys, picked);
                    }
                }}
            >
                {(item) => {
                    const color = getColor?.(item.user.id);
                    const style = isSelectedId(item.user.id) && color ? { backgroundColor: color.bg } : undefined;
                    return (
                        <ListboxItem key={item.user.id} textValue={item.user.name} style={style}>
                            <div className="flex gap-2 items-center">
                                <Avatar
                                    alt={item.user.name}
                                    className="shrink-0"
                                    size="sm"
                                    name={item.user.name}
                                    src={item.avatar}
                                />
                                <div className="flex flex-col">
                                    <span className="text-small">{item.user.name}</span>
                                    <div className="flex flex-row gap-1">
                                        <span className="text-tiny text-default-400">{item.user.id}</span>
                                        <span className="text-tiny text-default-400">{item.user.username}</span>
                                        <span className="text-tiny text-default-400">{item.user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </ListboxItem>
                    );
                }}
            </Listbox >
        </ListboxWrapper >
    );
}
