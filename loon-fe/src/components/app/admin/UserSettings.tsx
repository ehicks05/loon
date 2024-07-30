import React from "react";
import { useUserStore2 } from "../../../common/UserContextProvider";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../Button";
import { CheckboxInput } from "../../TextInput";

export default function UserSettings() {
  const { user: currentUser } = useUserStore2();
  const { data: users } = trpc.misc.users.useQuery();
  const { mutate: deleteUser } = trpc.misc.deleteUser.useMutation();
  const { mutate: updateUser } = trpc.misc.updateUser.useMutation();

  function handleDelete(id) {
    if (confirm("are you sure?")) {
      deleteUser({ id });
    }
  }

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
                <td className="p-2">{user.username}</td>
                <td className="p-2">
                  <CheckboxInput
                    checked={user.isAdmin}
                    disabled={user.id === currentUser.id}
                    onChange={(e) =>
                      updateUser({ id: user.id, isAdmin: e.target.checked })
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
