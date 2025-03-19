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
import { Loader2, Upload } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const plantDiseaseSchema = z.object({
  location: z.string().min(1, "Location is required"),
  soilType: z.string().min(1, "Soil type is required"),
  imageUrl: z.string().url("Please provide a valid image URL"),
});

type PlantDiseaseFormData = z.infer<typeof plantDiseaseSchema>;

export default function PlantDisease() {
  const { toast } = useToast();
  const [result, setResult] = useState<any>(null);

  const form = useForm<PlantDiseaseFormData>({
    resolver: zodResolver(plantDiseaseSchema),
    defaultValues: {
      location: "",
      soilType: "",
      imageUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PlantDiseaseFormData) => {
      const res = await apiRequest("POST", "/api/predict/plant-disease", data);
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data.result);
      toast({
        title: "Analysis Complete",
        description: "Plant disease prediction has been generated",
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
            <h2 className="text-3xl font-bold tracking-tight">Plant Disease Detection</h2>
            <p className="text-muted-foreground">Upload plant images for disease analysis</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Form</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form 
                    onSubmit={form.handleSubmit((data) => mutation.mutate(data))} 
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter location" {...field} />
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
                            <Input placeholder="Enter soil type" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter image URL" {...field} />
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
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Analyze Image
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Detected Disease</h4>
                    <p className="text-lg">{result.disease}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Confidence</h4>
                    <p className="text-lg">{(result.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Recommendations</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {result.recommendations.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
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
