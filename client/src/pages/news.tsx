import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Bookmark, BookmarkCheck } from "lucide-react";

const categories = [
  "All",
  "Organic Farming",
  "AI in Agriculture",
  "Sustainable Practices",
  "Market Trends",
];

export default function News() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  const { data: news, isLoading } = useQuery({
    queryKey: ["/api/news", activeCategory],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(`/api/news?category=${queryKey[1]}`);
      if (!response.ok) throw new Error("Failed to fetch news");
      return response.json();
    },
  });

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Agricultural News</h2>
            <p className="text-muted-foreground">Stay updated with the latest in farming</p>
          </div>

          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="flex-wrap h-auto p-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-4 py-2"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news?.articles.map((article: any) => (
                <Card key={article.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(article.id)}
                      >
                        {bookmarked.has(article.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {new Date(article.date).toLocaleDateString()}
                      </span>
                      <Button variant="link" className="p-0">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
