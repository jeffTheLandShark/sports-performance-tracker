import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, Calendar } from "lucide-react";
import { Performance } from "../lib/db";

interface Props {
  stats: Performance[];
  viewMode: "all" | "athlete" | "team";
  selectedAthlete: string | null;
  selectedTeam: string | null;
}

const formatKey = (k: string) =>
  k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

export function Dashboard({
  stats,
  viewMode,
  selectedAthlete,
  selectedTeam,
}: Props) {
  const filtered = stats.filter((s) => {
    if (viewMode === "athlete") return s.athleteId === selectedAthlete;
    if (viewMode === "team") return s.teamId === selectedTeam;
    return true;
  });

  const getPrimaryMetric = (s: Performance) => Object.entries(s.stats || {})[0];

  const getPersonalBests = () => {
    const map = new Map<string, Performance>();

    filtered.forEach((stat) => {
      const key = `${stat.sport}-${stat.event}`;
      const current = getPrimaryMetric(stat);
      if (!current) return;

      const [, val] = current;
      const existing = map.get(key);

      if (!existing) {
        map.set(key, stat);
        return;
      }

      const existingVal = getPrimaryMetric(existing)?.[1] ?? -Infinity;

      if (val > existingVal) map.set(key, stat);
    });

    return Array.from(map.values());
  };

  const bests = getPersonalBests();

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl">Personal Bests</h2>
        <Badge>{bests.length}</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {bests.map((stat) => (
          <Card key={stat._id}>
            <CardHeader>
              <CardTitle>{stat.event}</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm text-slate-500 mb-2">{stat.sport}</div>

              <div className="space-y-1">
                {Object.entries(stat.stats || {}).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span>{formatKey(k)}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(stat.date).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
