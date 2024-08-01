import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import superFetch from "./common/SuperFetch";
import { useUserStore2 } from "./common/UserContextProvider";

function GithubLogin() {
  const { search } = useLocation();
  const { user } = useUserStore2();
  const history = useHistory();

  useEffect(() => {
    const doIt = async () => {
      const response = await superFetch("/login/github", { method: "GET" });

      document.location.href = await response.text();
    };

    if (!search) {
      console.log("step 1");
      doIt();
    }
  }, [search]);

  useEffect(() => {
    const doIt = async () => {
      const response = await superFetch(`/login/github/callback${search}`, {
        method: "GET",
      });
    };

    if (search) {
      console.log("step 2");
      doIt();
    }
  }, [search]);

  useEffect(() => {
    if (user) {
      console.log("step 3");
      history.push("/");
    }
  }, [user, history]);

  return <div className="max-w-xl mx-auto my-auto p-16">yo</div>;
}

export { GithubLogin };
