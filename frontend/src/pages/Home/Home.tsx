import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    fetchUsers,
    selectUsers,
    selectUsersLoading,
} from "@/store/usersSlice";

import DefaultLayout from "@/layouts/default";


import { getDeterministicAvatarUrl } from "@/utils/avatar";
import { PostItem, PostsListbox } from "@/components/Listbox/PostListbox";
import { fetchPosts, selectPosts, selectPostsLoading } from "@/store/postsSlice";
import { colorForUserId } from "@/utils/colors";
import { UserItem, UserListbox } from "@/components/Listbox/User";

export default function Home() {
    const dispatch = useAppDispatch();
    const users = useAppSelector(selectUsers);
    const posts = useAppSelector(selectPosts);
    const uLoading = useAppSelector(selectUsersLoading);
    const pLoading = useAppSelector(selectPostsLoading);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchPosts());
    }, [dispatch]);

    const userItems: UserItem[] = users.map((u) => ({
        user: {
            id: u.id,
            name: u.name,
            username: u.username,
            email: u.email,
        },
        avatar: getDeterministicAvatarUrl(`${u.id}-${u.email}`),
    }));

    const allPostItems: PostItem[] = posts.map((p) => ({
        id: p.id,
        userId: p.userId,
        title: p.title,
    }));

    const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

    const onUsersChange = (_: unknown, selectedUsers: UserItem[]) => {
        const ids = new Set(selectedUsers.map((u) => u.user.id));
        setSelectedUserIds(ids);
    };

    const userColorMap = useMemo(() => {
        const map: Record<number, { bg: string; solid?: string }> = {}
        for (const u of userItems) map[u.user.id] = colorForUserId(u.user.id)
        return map
    }, [userItems])

    // Filtrelenmiş postlar (Users seçimine göre)
    const filteredPostItems = useMemo(() => {
        if (!selectedUserIds.size) return allPostItems;
        return allPostItems.filter((p) => selectedUserIds.has(p.userId));
    }, [allPostItems, selectedUserIds]);

    const highlightByUserId = useMemo(() => {
        const out: Record<number, string> = {}
        for (const uid of selectedUserIds) {
            const c = userColorMap[uid]
            if (c) out[uid] = c.bg
        }
        return out
    }, [selectedUserIds, userColorMap])


    return (
        <DefaultLayout>
            <div className="relative m-0 p-0 flex flex-col mb-10 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full px-4 text-black dark:text-white">
                    {uLoading ? (
                        <p>Loading users…</p>
                    ) : (
                        <UserListbox
                            items={userItems}
                            label="Users"
                            defaultSelectedKeys={[]}
                            onSelectionChange={onUsersChange}
                            getColor={(id) => userColorMap[id]}  // ← seçili user item'larını renkle
                        />
                    )}

                    {pLoading ? (
                        <p>Loading posts…</p>
                    ) : (
                        <PostsListbox
                            items={filteredPostItems}
                            label={
                                (() => {
                                    let label = "Posts";
                                    if (selectedUserIds.size) {
                                        const userText = selectedUserIds.size > 1 ? "users" : "user";
                                        label = `Posts (filtered by ${selectedUserIds.size} ${userText})`;
                                    }
                                    return label;
                                })()
                            }
                            highlightByUserId={highlightByUserId} // ← postları aynı renkle vurgula
                        />
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
}
