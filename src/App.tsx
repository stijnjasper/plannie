import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ProfileProvider } from "./contexts/ProfileContext";
import Index from "./pages/Index";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <ProfileProvider>
          <BrowserRouter>
            <Index />
            <Toaster />
          </BrowserRouter>
        </ProfileProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;