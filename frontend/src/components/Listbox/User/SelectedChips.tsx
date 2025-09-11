import React from "react";
import { Chip, ScrollShadow } from "@heroui/react";
import { EditIcon } from "lucide-react";
import type { UserItem, GetColor } from "./types";

type Props = {
    readonly selectedKeys: string[];
    readonly itemsById: Map<string, UserItem>;
    readonly getColor?: GetColor;
    readonly onEdit: (userId: number) => void;
};

export function SelectedChips({ selectedKeys, itemsById, getColor, onEdit }: Props) {
    if (!selectedKeys.length) return null;

    return (
        <ScrollShadow
            hideScrollBar
            className="w-full flex py-0.5 px-2 gap-1"
            orientation="horizontal"
        >
            {selectedKeys.map((key) => {
                const record = itemsById.get(key);
                if (!record) return null;
                const { user } = record;
                const color = getColor?.(user.id);

                const handleEdit = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onEdit(user.id);
                };

                return (
                    <Chip
                        key={key}
                        className="border-0"
                        style={color ? { backgroundColor: color.bg } : undefined}
                    >
                        <div className="flex items-center gap-2">
                            <span>{user.name}</span>
                            <button
                                type="button"
                                aria-label={`Edit ${user.name}`}
                                className="inline-flex h-6 min-w-5 items-center justify-center rounded-[4px] px-1 text-[10px] font-semibold hover:opacity-90 focus:outline-none focus:ring-1"
                                style={color ? { backgroundColor: color.solid, color: "white" } : undefined}
                                onClick={handleEdit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") handleEdit(e as any);
                                }}
                            >
                                <EditIcon size={14} />
                            </button>
                        </div>
                    </Chip>
                );
            })}
        </ScrollShadow>
    );
}
