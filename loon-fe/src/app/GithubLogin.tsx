import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import superFetch from "../common/SuperFetch";
import { trpc } from "../utils/trpc";

function GithubLogin() {
  const { search } = useLocation();
  const utils = trpc.useUtils();
  const { data: user } = trpc.misc.me.useQuery();
  const navigate = useNavigate();

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
      utils.invalidate();
    };

    if (search) {
      doIt();
    }
  }, [search, utils]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return null;
}

export { GithubLogin };
