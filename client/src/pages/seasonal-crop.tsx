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
import { Loader2, Sun } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const seasonalCropSchema = z.object({
  nitrogen: z.string().regex(/^\d*\.?\d*$/, "Must be a valid number"),
  phosphorus: z.string().regex(/^\d*\.?\d*$/, "Must be a valid number"),
  potassium: z.string().regex(/^\d*\.?\d*$/, "Must be a valid number"),
  region: z.string().min(1, "Region is required"),
});

type SeasonalCropFormData = z.infer<typeof seasonalCropSchema>;

export default function SeasonalCrop() {
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<any>(null);

  const form = useForm<SeasonalCropFormData>({
    resolver: zodResolver(seasonalCropSchema),
    defaultValues: {
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      region: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SeasonalCropFormData) => {
      const res = await apiRequest("POST", "/api/predict/season-crop", data);
      return res.json();
    },
    onSuccess: (data) => {
      setPrediction(data.result);
      toast({
        title: "Success",
        description: "Seasonal crop predictions have been generated",
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
            <h2 className="text-3xl font-bold tracking-tight">Seasonal Crop Prediction</h2>
            <p className="text-muted-foreground">Get crop recommendations based on soil NPK values</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Soil Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form 
                    onSubmit={form.handleSubmit((data) => mutation.mutate(data))} 
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="nitrogen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nitrogen (N) Level</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter nitrogen content" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phosphorus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phosphorus (P) Level</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phosphorus content" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="potassium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Potassium (K) Level</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter potassium content" {...field} />
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
                        <Sun className="mr-2 h-4 w-4" />
                      )}
                      Predict Crops
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {prediction && (
              <Card>
                <CardHeader>
                  <CardTitle>Predicted Crops for {prediction.season}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prediction.crops.map((crop: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-primary/5"
                      >
                        <div className="flex items-center gap-3">
                          <Sun className="h-5 w-5 text-primary" />
                          <span className="font-medium">{crop.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {(crop.confidence * 100).toFixed(1)}% confidence
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
