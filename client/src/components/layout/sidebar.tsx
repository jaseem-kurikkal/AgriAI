import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Leaf,
  Sprout,
  Sun,
  Newspaper,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  Microscope,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Plant Disease", href: "/plant-disease", icon: Leaf },
  { name: "Seed Recommendation", href: "/seed-recommendation", icon: Sprout },
  { name: "Seasonal Crop", href: "/seasonal-crop", icon: Sun },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "AI Assistant", href: "/chatbot", icon: MessageSquare },
  { name: "AI Analysis", href: "/ai-analysis", icon: Microscope },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  return (
    <div className="flex h-screen flex-col gap-y-5 bg-sidebar border-r border-sidebar-border p-4">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/" className="flex items-center gap-2 text-sidebar-primary">
          <Leaf className="h-8 w-8" />
          <span className="text-xl font-bold">AgriAI</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
              location === item.href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-6 w-6 shrink-0" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-y-4">
        {user && (
          <>
            <div className="flex items-center gap-2 px-2 py-3 text-sm">
              <div className="flex-1">
                <p className="font-medium text-sidebar-foreground">{user.fullName || user.username}</p>
                <p className="text-xs text-sidebar-foreground/60">{user.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
}