import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import App from "./App";
import { trpc } from "./utils/trpc";
import { BrowserRouter } from "react-router-dom";
import { API_URL } from "../env";

const TRPC_URL = `${API_URL}/trpc`;

const QUERY_CLIENT_OPTIONS = {
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: false } },
};

export const AppWrap = () => {
  const [queryClient] = useState(() => new QueryClient(QUERY_CLIENT_OPTIONS));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: TRPC_URL,
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
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
