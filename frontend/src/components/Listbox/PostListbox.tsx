import React from "react";
import {
    Listbox,
    ListboxItem,
    Chip,
    ScrollShadow,
    type Selection,
} from "@heroui/react";
import { ListboxWrapper } from "./ListboxWrapper";

export type PostItem = {
    id: number;
    userId: number;
    title: string;
};

type Props = {
    readonly items: readonly PostItem[];
    readonly label?: string;
    readonly defaultSelectedKeys?: Iterable<string>;
    readonly onSelectionChange?: (keys: Selection, selectedItems: PostItem[]) => void;
};

export function PostsListbox({
    items,
    label = "Posts",
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
                    const p = items.find((x) => String(x.id) === key);
                    return <Chip key={key}>{p?.title ?? "Untitled"}</Chip>;
                })}
            </ScrollShadow>
        );
    }, [selectedIds, items]);

    return (
        <ListboxWrapper>
            <Listbox
                classNames={{ list: "max-h-[620px] overflow-y-scroll" }}
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
                    <ListboxItem key={item.id} textValue={item.title}>
                        <div className="flex flex-col">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-tiny text-default-500">
                                userId: {item.userId} • id: {item.id}
                            </span>
                        </div>
                    </ListboxItem>
                )}
            </Listbox>
        </ListboxWrapper>
    );
}
