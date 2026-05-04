import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface Performance {
  _id: string;
  athleteId?: string;
  athlete?: {
    name: string;
    sport: string;
  };
  sport: string;
  event: string;
  date: string;
  stats: Record<string, any>;
  notes?: string;
}

export const History: React.FC = () => {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadPerformances();
  }, []);

  const loadPerformances = async () => {
    try {
      const res = await fetch("http://localhost:5050/performances");
      const data = await res.json();
      setPerformances(data);
    } catch (error) {
      console.error("Error loading performances:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPerformances = performances.filter((perf) => {
    if (!filter) return true;
    return (
      perf.sport.toLowerCase().includes(filter.toLowerCase()) ||
      perf.event.toLowerCase().includes(filter.toLowerCase()) ||
      perf.athlete?.name.toLowerCase().includes(filter.toLowerCase())
    );
  });

  if (loading) {
    return <div className="text-center py-8">Loading history...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📁</span>
        <h2 className="text-2xl font-semibold">Performance History</h2>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by sport, event, or athlete..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-input-background"
        />
      </div>

      <div className="space-y-3">
        {filteredPerformances.length > 0 ? (
          filteredPerformances.map((performance) => (
            <Card key={performance._id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {performance.event}
                      </h3>
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                        {performance.sport}
                      </span>
                    </div>
                    {performance.athlete && (
                      <p className="text-sm text-muted-foreground mb-2">
                        By {performance.athlete.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(performance.date).toLocaleDateString()} at{" "}
                      {new Date(performance.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1">
                      {Object.entries(performance.stats).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-muted-foreground">{key}:</span>{" "}
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {performance.notes && (
                  <p className="text-sm text-muted-foreground mt-3 border-t pt-2">
                    {performance.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-8">
            <p className="text-muted-foreground">No performances found.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
