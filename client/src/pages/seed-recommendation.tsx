import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sprout } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const seedRecommendationSchema = z.object({
  soilPh: z.string().regex(/^\d*\.?\d*$/, "Must be a valid pH value"),
  temperature: z.string().regex(/^\d*\.?\d*$/, "Must be a valid temperature"),
  rainfall: z.string().regex(/^\d*\.?\d*$/, "Must be a valid rainfall amount"),
  region: z.string().min(1, "Region is required"),
});

type SeedRecommendationFormData = z.infer<typeof seedRecommendationSchema>;

export default function SeedRecommendation() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<any>(null);

  const form = useForm<SeedRecommendationFormData>({
    resolver: zodResolver(seedRecommendationSchema),
    defaultValues: {
      soilPh: "",
      temperature: "",
      rainfall: "",
      region: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SeedRecommendationFormData) => {
      const res = await apiRequest("POST", "/api/predict/seed", data);
      return res.json();
    },
    onSuccess: (data) => {
      setRecommendations(data.result);
      toast({
        title: "Success",
        description: "Seed recommendations have been generated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Seed Recommendation</h2>
            <p className="text-muted-foreground">Get AI-powered seed suggestions based on your conditions</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form 
                    onSubmit={form.handleSubmit((data) => mutation.mutate(data))} 
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="soilPh"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soil pH</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter soil pH (e.g. 6.5)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Temperature (°C)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter temperature" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rainfall"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Rainfall (mm)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter rainfall" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your region" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sprout className="mr-2 h-4 w-4" />
                      )}
                      Get Recommendations
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Seeds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.recommendations.map((rec: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-primary/5"
                      >
                        <div className="flex items-center gap-3">
                          <Sprout className="h-5 w-5 text-primary" />
                          <span className="font-medium">{rec.seed}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {(rec.confidence * 100).toFixed(1)}% match
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
