import { Performance } from "../lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, Calendar, User } from "lucide-react";

interface DashboardProps {
  stats: Performance[];
  viewMode?: "all" | "athlete" | "team";
  viewId?: string; // athleteId or teamId
}

export function Dashboard({ stats, viewMode, viewId }: DashboardProps) {
  const filtered = stats.filter((s) =>
    viewId ? s.athleteId === viewId || s.teamId === viewId : true,
  );

  const getPersonalBests = () => {
    const bests = new Map<string, Performance>();

    for (const stat of filtered) {
      const key = `${stat.sport}-${stat.event}`;
      const existing = bests.get(key);

      if (!existing) {
        bests.set(key, stat);
        continue;
      }

      const isBetter = stat.event.toLowerCase().includes("time")
        ? stat.stats?.value < existing.stats?.value
        : stat.stats?.value > existing.stats?.value;

      if (isBetter) bests.set(key, stat);
    }

    return Array.from(bests.values());
  };

  const personalBests = getPersonalBests();

  const grouped = personalBests.reduce(
    (acc, stat) => {
      acc[stat.sport] = acc[stat.sport] || [];
      if (stat.athleteId === viewId || stat.teamId === viewId || !viewId) {
        acc[stat.sport].push(stat);
      }
      return acc;
    },
    {} as Record<string, Performance[]>,
  );

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([sport, entries]) => (
        <Card key={sport}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {sport}
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-3 md:grid-cols-3">
            {entries.map((p) => (
              <div key={p._id} className="p-4 rounded-lg border bg-slate-50">
                <div className="text-sm text-slate-500">{p.event}</div>

                <div className="text-2xl font-semibold">
                  {Object.values(p.stats || {})[0]}{" "}
                  <Badge className="ml-2">
                    {Object.keys(p.stats || {})[0]}
                  </Badge>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(p.date).toLocaleDateString()}
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                  <User className="w-3 h-3" />
                  {p.athleteId
                    ? p.athlete?.name || p.team?.name || "" : p.team?.name || ""}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
