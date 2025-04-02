
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DealProvider } from "@/contexts/DealContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateDeal from "./pages/CreateDeal";
import DealDetail from "./pages/DealDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DealProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-deal" element={<CreateDeal />} />
                <Route path="/deals/:id" element={<DealDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </DealProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
