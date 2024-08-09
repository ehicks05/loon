import { FaGithub } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { Button } from "../components/Button";

function Login() {
  const history = useHistory();

  return (
    <section className="flex flex-col gap-4">
      <div className="text-2xl font-bold">Sign In</div>
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
