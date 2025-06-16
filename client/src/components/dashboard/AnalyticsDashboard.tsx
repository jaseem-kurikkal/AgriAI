import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface FieldData {
  id: string;
  name: string;
  health_history: Array<{
    date: string;
    score: number;
  }>;
  yield_history: Array<{
    date: string;
    actual: number;
    predicted: number;
  }>;
  nutrient_history: Array<{
    date: string;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  }>;
}

export function AnalyticsDashboard() {
  const { data: fields, isLoading } = useQuery<FieldData[]>({
    queryKey: ["fields"],
    queryFn: async () => {
      const response = await fetch("/api/fields");
      if (!response.ok) throw new Error("Failed to fetch field data");
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!fields || fields.length === 0) {
    return <div>No field data available</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={fields[0].id} className="space-y-6">
        <TabsList>
          {fields.map((field) => (
            <TabsTrigger key={field.id} value={field.id}>
              {field.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {fields.map((field) => (
          <TabsContent key={field.id} value={field.id} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Health Score Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Crop Health Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={field.health_history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#4CAF50"
                          name="Health Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Yield Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle>Yield Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={field.yield_history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke="#2196F3"
                          name="Actual Yield"
                        />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke="#FF9800"
                          name="Predicted Yield"
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Nutrient Levels */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Nutrient Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={field.nutrient_history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="nitrogen" fill="#2196F3" name="Nitrogen" />
                        <Bar
                          dataKey="phosphorus"
                          fill="#4CAF50"
                          name="Phosphorus"
                        />
                        <Bar
                          dataKey="potassium"
                          fill="#FF9800"
                          name="Potassium"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
