import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import UnderProcess from "@/pages/under-process";

function Router() {
  return (
    <Switch>
      <Route path="/" component={UnderProcess} />
      <Route path="/auth" component={UnderProcess} />
      <Route path="/plant-disease" component={UnderProcess} />
      <Route path="/seed-recommendation" component={UnderProcess} />
      <Route path="/seasonal-crop" component={UnderProcess} />
      <Route path="/news" component={UnderProcess} />
      <Route path="/chatbot" component={UnderProcess} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;