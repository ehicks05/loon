import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/Button';
import { CheckboxInput } from '@/components/TextInput';
import { authClient } from '@/lib/auth-client';

export default function UserSettings() {
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
				<h1 className="font-bold text-2xl">Admin</h1>
				<h2>Users</h2>
			</section>
			<section>
				<table>
					<thead>
						<tr>
							<th className="p-2 text-left">Id</th>
							<th className="p-2 text-left">Username</th>
							<th className="p-2 text-left">Admin</th>
							<th className="p-2 text-left"> </th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								<td className="p-2">{user.id}</td>
								<td className="p-2">{user.name}</td>
								<td className="p-2">
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
								<td className="p-2">
									<Button
										className="bg-red-600"
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
