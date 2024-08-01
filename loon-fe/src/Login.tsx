import React from "react";
import { FaGithub } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { Button } from "./components/Button";
import { trpc } from "./utils/trpc";

function Login() {
  const { data: user } = trpc.misc.me.useQuery();
  const history = useHistory();

  return (
    <section className="w-full mx-auto my-auto p-16">
      <Button
        className="flex gap-2 items-center px-6 py-3"
        onClick={() => history.push("/login/github")}
      >
        <FaGithub /> Sign in with GitHub
      </Button>
    </section>
  );
}

export { Login };
