import { useQuery } from '@tanstack/react-query';
import { CheckboxInput } from '@/components/TextInput';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function Users() {
	const { data: session } = authClient.useSession();
	const currentUser = session?.user;

	const { listUsers, removeUser, setRole } = authClient.admin;

	const { data: userResponse } = useQuery({
		queryKey: ['listUsers'],
		queryFn: () => listUsers({ query: {} }),
	});
	const users = userResponse?.data?.users;

	function handleDelete(userId: string) {
		if (confirm('are you sure?')) {
			removeUser({ userId });
		}
	}

	if (userResponse?.error) return <div>{userResponse.error.message}</div>;
	if (!currentUser || !users) return <div>Loading...</div>;

	return (
		<div className="flex flex-col gap-4">
			<section>
				<table>
					<thead>
						<tr>
							<th className="p-1 text-left">Id</th>
							<th className="p-1 text-left">Username</th>
							<th className="p-1 text-left">Admin</th>
							<th className="p-1 text-left"> </th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								<td className="p-1" title={user.id}>
									{user.id.slice(0, 5)}...
								</td>
								<td className="p-1">{user.name}</td>
								<td className="p-1">
									<CheckboxInput
										checked={user.role === 'admin'}
										disabled={user.id === currentUser.id}
										onChange={(e) =>
											setRole({
												userId: user.id,
												role: e.target.checked ? 'admin' : 'user',
											})
										}
									/>
								</td>
								<td className="p-1">
									<Button
										variant="destructive"
										onClick={() => handleDelete(user.id)}
										disabled={user.id === currentUser.id}
									>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</div>
	);
}
