import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Link } from "wouter";

const mockData = {
  soilHealth: [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 70 },
    { month: "Mar", value: 75 },
    { month: "Apr", value: 72 },
    { month: "May", value: 80 },
    { month: "Jun", value: 85 },
  ],
  predictions: [
    { name: "Plant Disease", count: 24, href: "/plant-disease" },
    { name: "Seed Recommendation", count: 18, href: "/seed-recommendation" },
    { name: "Seasonal Crop", count: 12, href: "/seasonal-crop" },
  ],
};

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  loading?: boolean;
  href?: string;
}

export function StatCard({ title, value, description, loading, href }: StatCardProps) {
  const CardWrapper = href ? Link : "div";
  return (
    <CardWrapper href={href}>
      <Card className={href ? "cursor-pointer transition-colors hover:bg-accent" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}

export function SoilHealthChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Soil Health Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData.soilHealth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {mockData.predictions.map((pred) => (
        <StatCard
          key={pred.name}
          title={pred.name}
          value={pred.count}
          description="Total predictions"
          href={pred.href}
        />
      ))}
      <StatCard
        title="Soil Health Score"
        value="85%"
        description="Current rating"
      />
    </div>
  );
}