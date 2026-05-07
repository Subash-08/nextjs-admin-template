import { getUsers } from "@/services/user.service";
import { formatDate } from "@/lib/utils";

// Server Component
export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Users Management</h1>
            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted border-b">
                        <tr>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Role</th>
                            <th className="p-4 font-medium">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((user: any) => (
                            <tr key={user._id.toString()} className="hover:bg-muted/50">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-muted-foreground">
                                    {formatDate(user.createdAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
