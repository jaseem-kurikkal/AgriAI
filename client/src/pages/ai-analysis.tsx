import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { ImageAnalysis } from "@/components/analysis/ImageAnalysis";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AIAnalysis() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AI Analysis</h2>
            <p className="text-muted-foreground">
              Analyze crops, soil, and predict yields using AI
            </p>
          </div>

          <Tabs defaultValue="analysis" className="space-y-6">
            <TabsList>
              <TabsTrigger value="analysis">Image Analysis</TabsTrigger>
              <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6">
              <ImageAnalysis />
            </TabsContent>

            <TabsContent value="dashboard">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
