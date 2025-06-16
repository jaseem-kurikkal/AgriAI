import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";

interface AnalysisResult {
  health_score: number;
  diseases: Array<{name: string; probability: number}>;
  nutrient_levels: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  recommendations: string[];
}

export function ImageAnalysis() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analysisType, setAnalysisType] = useState<'health' | 'soil' | 'pest'>('health');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const { mutate: analyzeImage, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/analyze/${analysisType}`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Analysis failed');
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);
    analyzeImage(formData);
  };

  return (
    <div className="space-y-6">
      <Tabs value={analysisType} onValueChange={(v) => setAnalysisType(v as typeof analysisType)}>
        <TabsList>
          <TabsTrigger value="health">Crop Health</TabsTrigger>
          <TabsTrigger value="soil">Soil Analysis</TabsTrigger>
          <TabsTrigger value="pest">Pest Detection</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-sm rounded-lg border"
                />
              </div>
            )}
            <Button
              type="submit"
              className="mt-4"
              disabled={!selectedImage || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analyze Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.health_score !== undefined && (
                <div>
                  <h4 className="font-semibold">Health Score</h4>
                  <div className="text-2xl">{result.health_score}%</div>
                </div>
              )}
              
              {result.diseases && result.diseases.length > 0 && (
                <div>
                  <h4 className="font-semibold">Detected Issues</h4>
                  <ul className="list-disc pl-5">
                    {result.diseases.map((disease, index) => (
                      <li key={index}>
                        {disease.name} ({(disease.probability * 100).toFixed(1)}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.nutrient_levels && (
                <div>
                  <h4 className="font-semibold">Nutrient Levels</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Nitrogen</div>
                      <div className="text-lg">{result.nutrient_levels.nitrogen}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Phosphorus</div>
                      <div className="text-lg">{result.nutrient_levels.phosphorus}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Potassium</div>
                      <div className="text-lg">{result.nutrient_levels.potassium}%</div>
                    </div>
                  </div>
                </div>
              )}

              {result.recommendations && (
                <div>
                  <h4 className="font-semibold">Recommendations</h4>
                  <ul className="list-disc pl-5">
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
