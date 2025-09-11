import React from "react";
import {
    Listbox,
    ListboxItem,
    Chip,
    ScrollShadow,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    type Selection,
} from "@heroui/react";
import { ListboxWrapper } from "./ListboxWrapper";
import { PostModal } from "./Post/PostModal";
import type { Post, NewPost } from "@/domain/types";
import { PlusIcon } from "lucide-react";

export type PostItem = {
    id: number;
    userId: number;
    title: string;
    body?: string;
};

type Props = {
    readonly items: readonly PostItem[];
    readonly availableUsers?: Array<{ id: number; name: string }>;
    readonly label?: string;
    readonly defaultSelectedKeys?: Iterable<string>;
    readonly isLoading?: boolean;
    readonly error?: string | null;
    readonly onSelectionChange?: (keys: Selection, selectedItems: PostItem[]) => void;
    readonly highlightByUserId?: Record<number, string>;
    readonly onCreatePost?: (post: NewPost) => Promise<void> | void;
    readonly onUpdatePost?: (id: number, post: Partial<Post>) => Promise<void> | void;
    readonly onDeletePost?: (id: number) => Promise<void> | void;
};

export function PostsListbox({
    items,
    availableUsers = [],
    label = "Posts",
    defaultSelectedKeys = [],
    isLoading = false,
    error = null,
    onSelectionChange,
    highlightByUserId,
    onCreatePost,
    onUpdatePost,
    onDeletePost
}: Props) {
    const [selected, setSelected] = React.useState<Selection>(
        new Set(defaultSelectedKeys)
    );

    // Modal state management
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create');
    const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);

    const selectedIds = React.useMemo(() => {
        if (selected === "all") return items.map((i) => String(i.id));
        return Array.from(selected).map(String);
    }, [selected, items]);

    // Modal handlers
    const handleCreatePost = (): void => {
        setModalMode('create');
        setSelectedPost(null);
        setIsModalOpen(true);
    };

    const handleEditPost = (post: PostItem): void => {
        setModalMode('edit');
        setSelectedPost({
            id: post.id,
            userId: post.userId,
            title: post.title,
            body: post.body || ''
        });
        setIsModalOpen(true);
    };



    const handleCloseModal = (): void => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex justify-end items-center">
                    {onCreatePost && (
                        <Button
                            color="primary"
                            size="sm"
                            onPress={handleCreatePost}
                            isDisabled={isLoading}
                        >
                            <PlusIcon size={14} />
                        </Button>
                    )}
                </div>

                {selectedIds.length > 0 && (
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
                )}
            </div>
        );
    }, [selectedIds, items, label, onCreatePost, isLoading, handleCreatePost]);

    return (
        <>
            <ListboxWrapper>
                <Listbox
                    classNames={{ list: "max-h-[600px] overflow-y-scroll" }}
                    items={items}
                    label={label}
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
                    {(item) => {
                        const bg = highlightByUserId?.[item.userId];
                        const style = bg ? { backgroundColor: bg } : undefined;
                        return (
                            <ListboxItem
                                key={item.id}
                                textValue={item.title}
                                style={style}
                            >
                                <div className="flex justify-between items-start group">
                                    <div className="flex flex-col flex-1">
                                        <span className="font-medium">{item.title}</span>
                                        <span className="text-tiny text-default-500">
                                            userId: {item.userId} • id: {item.id}
                                        </span>
                                        {item.body && (
                                            <span className="text-sm text-default-400 mt-1 line-clamp-2">
                                                {item.body}
                                            </span>
                                        )}
                                    </div>

                                    {(onUpdatePost || onDeletePost) && (
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="ghost"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ⋮
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu>
                                                <DropdownItem
                                                    key="edit"
                                                    onPress={() => handleEditPost(item)}
                                                >
                                                    Edit Post
                                                </DropdownItem>
                                                <DropdownItem
                                                    key="delete"
                                                    className="text-danger"
                                                    color="danger"
                                                    onPress={() => handleEditPost(item)}
                                                >
                                                    Delete Post
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    )}
                                </div>
                            </ListboxItem>
                        );
                    }}
                </Listbox>
            </ListboxWrapper>

            {/* Post Modal */}
            <PostModal
                isOpen={isModalOpen}
                mode={modalMode}
                post={selectedPost}
                availableUsers={availableUsers}
                isLoading={isLoading}
                error={error}
                onClose={handleCloseModal}
                onCreate={onCreatePost}
                onSave={onUpdatePost}
                onDelete={onDeletePost}
            />
        </>
    );
}
