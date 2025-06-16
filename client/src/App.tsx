import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import NotFound from "@/pages/not-found";
import UnderProcess from "@/pages/under-process";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import SeedRecommendation from "@/pages/seed-recommendation";
import News from "@/pages/news";
import AIFarmingAssistant from "@/pages/ai-farming-assistant";
import AIAnalysis from "@/pages/ai-analysis";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/plant-disease" component={UnderProcess} />
      <ProtectedRoute path="/seed-recommendation" component={SeedRecommendation} />
      <ProtectedRoute path="/seasonal-crop" component={UnderProcess} />
      <ProtectedRoute path="/news" component={News} />
      <ProtectedRoute path="/chatbot" component={AIFarmingAssistant} />
      <ProtectedRoute path="/ai-analysis" component={AIAnalysis} />
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