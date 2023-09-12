"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  // lazy initialization. Эта функция будет вызвана только один раз при первой отрисовки компонента, и результат её выполнения будет использован как начальное состояние переменной "queryClient"
  // "new QueryClient()" создается новый экземпляр QueryClient, который предоставляется библиотекой React Query. Этот экземпляр будет использоваться для управления запросами и кешированием данных

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
