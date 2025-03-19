import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function UnderProcess() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">AgriAI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Under Development</h2>
          <p className="text-muted-foreground">
            We're currently working on building amazing features for AgriAI. 
            Please check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
