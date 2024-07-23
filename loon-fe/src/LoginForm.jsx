import React, { useState } from "react";
import superFetch from "./common/SuperFetch";
import { fetchUser } from "./common/UserContextProvider";

function LoginForm() {
  const [failureMessage, setFailureMessage] = useState("");

  function login(e) {
    e.preventDefault();
    const formElement = document.getElementById("loginForm");
    const formData = new FormData(formElement);

    setFailureMessage("");

    superFetch(
      "/login",
      {
        method: "POST",
        body: new URLSearchParams(formData),
      },
      false,
    ).then((response) => {
      if (response?.status !== 200)
        setFailureMessage("Invalid username and/or password");
      fetchUser();
    });
  }

  return (
    <div className="max-w-xl mx-auto my-auto p-16">
      <form
        method="POST"
        action="/"
        id="loginForm"
        onSubmit={login}
        className="flex flex-col gap-4"
      >
        <div className="field">
          <div className="control">
            <input
              className="input w-full p-2"
              type="email"
              placeholder="Email"
              id="username"
              name="username"
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <input
              className="input w-full p-2"
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              autoComplete="password"
            />
          </div>
        </div>
        <button
          type="submit"
          className="p-2 rounded bg-green-500 text-white w-full"
        >
          Log in
        </button>
      </form>

      {failureMessage && (
        <div className="has-text-danger">{failureMessage}</div>
      )}
    </div>
  );
}

export default LoginForm;
