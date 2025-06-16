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
  soilPh: z.string().regex(/^\d*\.?\d*$/, "Must be a valid pH value (e.g., 6.5)"),
  temperature: z.string().regex(/^\d*\.?\d*$/, "Must be a valid temperature in °C"),
  rainfall: z.string().regex(/^\d*\.?\d*$/, "Must be a valid rainfall in mm/year"),
  region: z.string().min(1, "Region is required"),
  soilType: z.string().min(1, "Soil type is required"),
  irrigationAvailable: z.string().min(1, "Please specify irrigation availability"),
  farmingExperience: z.string().min(1, "Please specify farming experience")
});

type SeedRecommendationFormData = z.infer<typeof seedRecommendationSchema>;

export default function SeedRecommendation() {
  const { toast } = useToast();
  interface Recommendation {
    crop: string;
    variety: string;
    confidence: number;
    details: string;
  }

  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);

  const form = useForm<SeedRecommendationFormData>({
    resolver: zodResolver(seedRecommendationSchema),
    defaultValues: {
      soilPh: "",
      temperature: "",
      rainfall: "",
      region: "",
      soilType: "",
      irrigationAvailable: "",
      farmingExperience: ""
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SeedRecommendationFormData) => {
      const res = await apiRequest("POST", "/api/seed-recommendation", data);
      const json = await res.json();
      return json;
    },
    onSuccess: (data) => {
      setRecommendations(data.recommendations);
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
                            <select
                              {...field}
                              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select region</option>
                              <option value="Kerala">Kerala</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Andhra Pradesh">Andhra Pradesh</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Punjab">Punjab</option>
                              <option value="Haryana">Haryana</option>
                              <option value="Uttar Pradesh">Uttar Pradesh</option>
                              <option value="Madhya Pradesh">Madhya Pradesh</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="soilType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soil Type</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select soil type</option>
                              <option value="Alluvial">Alluvial Soil</option>
                              <option value="Black">Black Soil</option>
                              <option value="Red">Red Soil</option>
                              <option value="Laterite">Laterite Soil</option>
                              <option value="Sandy">Sandy Soil</option>
                              <option value="Clay">Clay Soil</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="irrigationAvailable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Irrigation Availability</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select irrigation availability</option>
                              <option value="Full">Full irrigation available</option>
                              <option value="Partial">Partial irrigation available</option>
                              <option value="Rainfed">Rainfed only</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="farmingExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Farming Experience</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select experience level</option>
                              <option value="Beginner">Beginner (0-2 years)</option>
                              <option value="Intermediate">Intermediate (2-5 years)</option>
                              <option value="Experienced">Experienced (5+ years)</option>
                            </select>
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
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Getting Recommendations...
                        </>
                      ) : (
                        "Get Recommendations"
                      )}
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
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-primary/5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Sprout className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">{rec.crop} - {rec.variety}</div>
                              <div className="text-sm text-muted-foreground">{rec.details}</div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-primary">
                            {(rec.confidence * 100).toFixed(1)}% match
                          </span>
                        </div>
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
