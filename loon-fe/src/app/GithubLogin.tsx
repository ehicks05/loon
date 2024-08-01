import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import superFetch from "../common/SuperFetch";
import { trpc } from "../utils/trpc";

function GithubLogin() {
  const { search } = useLocation();
  const { data: user, refetch } = trpc.misc.me.useQuery();
  const history = useHistory();

  useEffect(() => {
    const doIt = async () => {
      const response = await superFetch("/login/github", { method: "GET" });
      document.location.href = await response.text();
    };

    if (!search) {
      doIt();
    }
  }, [search]);

  useEffect(() => {
    const doIt = async () => {
      await superFetch(`/login/github/callback${search}`, { method: "GET" });
      refetch();
    };

    if (search) {
      doIt();
    }
  }, [search, refetch]);

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  return null;
}

export { GithubLogin };
