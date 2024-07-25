import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import superFetch from "./common/SuperFetch";

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
  const params = new URLSearchParams(search);

  useEffect(() => {
    const doIt = async () => {
      const response = await superFetch(`/login/github/callback${search}`, {
        method: "GET",
      });
    };

    doIt();
  }, []);

  return <div className="max-w-xl mx-auto my-auto p-16">yo</div>;
}

export { GithubLogin, GithubLoginCallback };
