import { useEffect } from "react"
import { fetchPosts, selectPosts, selectPostsError, selectPostsLoading } from "@/store/postsSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

export default function PostsPage() {
    const dispatch = useAppDispatch()
    const items = useAppSelector(selectPosts)
    const loading = useAppSelector(selectPostsLoading)
    const error = useAppSelector(selectPostsError)

    useEffect(() => { dispatch(fetchPosts()) }, [dispatch])

    return (
        <section>
            <h2 className="text-xl font-semibold mb-3">Posts</h2>
            {loading && <p>Loading…</p>}
            {error && <p className="text-red-400">{error}</p>}
            <div className="overflow-x-auto rounded-lg border border-content3">
                <table className="w-full border-collapse">
                    <thead className="bg-content2/30">
                        <tr>
                            <th className="p-3 text-left">userId</th>
                            <th className="p-3 text-left">id</th>
                            <th className="p-3 text-left">title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(p => (
                            <tr key={p.id} className="border-t border-content3">
                                <td className="p-3">{p.userId}</td>
                                <td className="p-3">{p.id}</td>
                                <td className="p-3">{p.title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
