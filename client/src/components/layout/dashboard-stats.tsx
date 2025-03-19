import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Link } from "wouter";
import { Leaf, Sprout, Sun, Newspaper, MessageSquare } from "lucide-react";

const modules = [
  { name: "Plant Disease Analysis", href: "/plant-disease", icon: Leaf },
  { name: "Seed Recommendation", href: "/seed-recommendation", icon: Sprout },
  { name: "Seasonal Crop Planning", href: "/seasonal-crop", icon: Sun },
  { name: "Agricultural News", href: "/news", icon: Newspaper },
  { name: "AI Farming Assistant", href: "/chatbot", icon: MessageSquare },
];

const soilHealth = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 70 },
  { month: "Mar", value: 75 },
  { month: "Apr", value: 72 },
  { month: "May", value: 80 },
  { month: "Jun", value: 85 },
];

interface ModuleCardProps {
  title: string;
  href: string;
  icon: React.ElementType;
}

function ModuleCard({ title, href, icon: Icon }: ModuleCardProps) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer transition-colors hover:bg-accent">
        <CardContent className="flex items-center gap-3 pt-6">
          <Icon className="h-6 w-6 text-primary" />
          <h3 className="font-medium">{title}</h3>
        </CardContent>
      </Card>
    </Link>
  );
}

export function SoilHealthChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Soil Health Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={soilHealth}>
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <ModuleCard
          key={module.name}
          title={module.name}
          href={module.href}
          icon={module.icon}
        />
      ))}
    </div>
  );
}