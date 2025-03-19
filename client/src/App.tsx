import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import PlantDisease from "@/pages/plant-disease";
import SeedRecommendation from "@/pages/seed-recommendation";
import SeasonalCrop from "@/pages/seasonal-crop";
import News from "@/pages/news";
import Chatbot from "@/pages/chatbot";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/plant-disease" component={PlantDisease} />
      <ProtectedRoute path="/seed-recommendation" component={SeedRecommendation} />
      <ProtectedRoute path="/seasonal-crop" component={SeasonalCrop} />
      <ProtectedRoute path="/news" component={News} />
      <ProtectedRoute path="/chatbot" component={Chatbot} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
