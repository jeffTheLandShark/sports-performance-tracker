import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar } from "lucide-react";
import {Performance} from "../lib/db";

interface Props {
  stats: Performance[];
  viewMode: "all" | "athlete" | "team";
  selectedAthlete: string | null;
  selectedTeam: string | null;
}

const formatKey = (k: string) =>
  k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

export function History({
  stats,
  viewMode,
  selectedAthlete,
  selectedTeam,
}: Props) {
  const filtered = stats
    .filter((s) => {
      if (viewMode === "athlete") return s.athleteId === selectedAthlete;
      if (viewMode === "team") return s.teamId === selectedTeam;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getMetricKey = (s: Performance) => Object.keys(s.stats || {})[0];

  const getImprovement = (stat: Performance, index: number) => {
    const key = getMetricKey(stat);
    if (!key) return null;

    const currentVal = stat.stats[key];

    const previous = filtered
      .slice(index + 1)
      .find(
        (s) =>
          s.event === stat.event &&
          s.sport === stat.sport &&
          (viewMode === "all" ||
            s.athleteId === stat.athleteId ||
            s.teamId === stat.teamId),
      );

    if (!previous) return null;

    const prevVal = previous.stats?.[key];
    if (prevVal === undefined) return null;

    const improved = currentVal > prevVal;

    return {
      improved,
      percent: (((currentVal - prevVal) / prevVal) * 100).toFixed(1),
    };
  };

  return (
    <div className="space-y-4">
      {filtered.map((stat, i) => {
        const imp = getImprovement(stat, i);

        return (
          <Card key={stat._id}>
            <CardHeader>
              <CardTitle>{stat.event}</CardTitle>
              <CardDescription>
                {stat.sport} • {stat.athleteName || stat.teamName} <Calendar className="inline" />
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-1">
                {Object.entries(stat.stats || {}).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span>{formatKey(k)}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-3 text-xs">
                <span className="text-slate-400">
                  {new Date(stat.date).toLocaleDateString()}
                </span>

                {imp && (
                  <Badge>
                    {imp.improved ? "↑" : "↓"} {imp.percent}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
