import { useEffect } from "react"
import { Listbox, ListboxItem } from "@heroui/listbox"
import { Link } from "react-router-dom"
import { fetchPosts, selectPosts, selectPostsLoading } from "@/store/postsSlise"
import { fetchUsers, selectUsers, selectUsersLoading } from "@/store/usersSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import DefaultLayout from "@/layouts/default"

export default function Home() {
    const dispatch = useAppDispatch()
    const users = useAppSelector(selectUsers)
    const posts = useAppSelector(selectPosts)
    const uLoading = useAppSelector(selectUsersLoading)
    const pLoading = useAppSelector(selectPostsLoading)

    useEffect(() => {
        dispatch(fetchUsers())
        dispatch(fetchPosts())
    }, [dispatch])

    return (
        <DefaultLayout>
            <section className="space-y-6">
                <h1 className="text-2xl font-bold">Homepage</h1>
                <div className="flex gap-4">
                    <Link className="underline" to="/users">Users</Link>
                    <Link className="underline" to="/posts">Posts</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="mb-2 font-semibold">Users (first 10)</h2>
                        {uLoading ? (
                            <p>Loading users…</p>
                        ) : (
                            <Listbox aria-label="Users list">
                                {users.slice(0, 10).map(u => (
                                    <ListboxItem key={u.id} textValue={`${u.username}`}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{u.name} <span className="opacity-60">(@{u.username})</span></span>
                                            <span className="text-sm opacity-80">{u.email}</span>
                                        </div>
                                    </ListboxItem>
                                ))}
                            </Listbox>
                        )}
                    </div>

                    <div>
                        <h2 className="mb-2 font-semibold">Posts (first 10)</h2>
                        {pLoading ? (
                            <p>Loading posts…</p>
                        ) : (
                            <Listbox aria-label="Posts list">
                                {posts.slice(0, 10).map(p => (
                                    <ListboxItem key={p.id} textValue={p.title}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{p.title}</span>
                                            <span className="text-sm opacity-80">userId: {p.userId} • id: {p.id}</span>
                                        </div>
                                    </ListboxItem>
                                ))}
                            </Listbox>
                        )}
                    </div>
                </div>
            </section>
        </DefaultLayout>
    )
}
