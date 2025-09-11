import { fetchUsers, selectUsers, selectUsersError, selectUsersLoading } from "@/store/usersSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

import { useEffect } from "react"
import DefaultLayout from "@/layouts/default"

export default function UsersPage() {
    const dispatch = useAppDispatch()
    const items = useAppSelector(selectUsers)
    const loading = useAppSelector(selectUsersLoading)
    const error = useAppSelector(selectUsersError)

    useEffect(() => { dispatch(fetchUsers()) }, [dispatch])

    return (
        <DefaultLayout>
            <h2 className="text-xl font-semibold mb-3">Users</h2>
            {loading && <p>Loading…</p>}
            {error && <p className="text-red-400">{error}</p>}
            <div className="overflow-x-auto rounded-lg border border-content3">
                <table className="w-full border-collapse">
                    <thead className="bg-content2/30">
                        <tr>
                            <th className="p-3 text-left">id</th>
                            <th className="p-3 text-left">name</th>
                            <th className="p-3 text-left">username</th>
                            <th className="p-3 text-left">email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(u => (
                            <tr key={u.id} className="border-t border-content3">
                                <td className="p-3">{u.id}</td>
                                <td className="p-3">{u.name}</td>
                                <td className="p-3">@{u.username}</td>
                                <td className="p-3">{u.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DefaultLayout>
    )
}
