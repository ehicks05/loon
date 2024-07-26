import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import superFetch from "./common/SuperFetch";
import { useUserStore2 } from "./common/UserContextProvider";

function GithubLogin() {
  useEffect(() => {
    const doIt = async () => {
      const response = await superFetch("/login/github", { method: "GET" });

      document.location.href = await response.text();
    };

    doIt();
  }, []);

  return <div className="max-w-xl mx-auto my-auto p-16">yo</div>;
}

function GithubLoginCallback() {
  const { search } = useLocation();
  const { user } = useUserStore2();
  const history = useHistory();

  useEffect(() => {
    const doIt = async () => {
      const response = await superFetch(`/login/github/callback${search}`, {
        method: "GET",
      });
    };

    if (!user) {
      doIt();
    } else {
      history.push("/");
    }
  }, [search, user, history]);

  return <div className="max-w-xl mx-auto my-auto p-16">yo</div>;
}

export { GithubLogin, GithubLoginCallback };
