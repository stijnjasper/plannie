import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ProfileProvider } from "./contexts/ProfileContext";
import Index from "./pages/Index";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <BrowserRouter>
          <Index />
          <Toaster />
        </BrowserRouter>
      </ProfileProvider>
    </QueryClientProvider>
  );
}

export default App;