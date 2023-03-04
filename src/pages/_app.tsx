import "@/styles/global.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "gray.800",
        color: "gray.50",
      },
    },
  },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
