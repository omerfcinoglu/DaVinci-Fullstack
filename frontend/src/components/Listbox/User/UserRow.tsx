import { Avatar } from "@heroui/react";
import type { UserItem } from "./types";

type Props = { readonly item: UserItem };

export function UserRow({ item }: Props) {
    return (
        <div className="flex items-center justify-between gap-3">
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
        </div>
    );
}
