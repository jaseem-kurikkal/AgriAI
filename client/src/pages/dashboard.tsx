import { Sidebar } from "@/components/layout/sidebar";
import { DashboardStats, SoilHealthChart } from "@/components/layout/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome to your agricultural insights</p>
          </div>

          <DashboardStats />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SoilHealthChart />

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">Plant Disease Analysis</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">Seed Recommendation</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
