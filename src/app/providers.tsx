'use client'

import { StorageProvider } from "@src/providers/storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <StorageProvider>{children}</StorageProvider>
    </QueryClientProvider>
  )
}