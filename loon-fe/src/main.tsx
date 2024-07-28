import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { trpc } from "./utils/trpc";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const UserFetchWrapper = () => {
  const { data, isLoading } = trpc.misc.me.useQuery();

  if (isLoading) return null;

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export const AppWrap = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UserFetchWrapper />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWrap />
  </React.StrictMode>,
);
