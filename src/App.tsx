import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import Home from "./pages/Home.tsx";
import Topics from "./pages/Topics.tsx";
import ProgressPage from "./pages/ProgressPage.tsx";
import ChecklistPage from "./pages/ChecklistPage.tsx";
import AppLayout from "./components/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { CloudDataProvider } from "@/hooks/useCloudData";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CloudDataProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/checklist" element={<ChecklistPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </CloudDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
