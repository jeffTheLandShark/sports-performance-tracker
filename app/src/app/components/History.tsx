import { Performance } from "../lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar } from "lucide-react";

interface Props {
  stats: Performance[];
  viewId?: string;
}

export function History({ stats, viewId }: Props) {
  const filtered = stats.filter((s) =>
    viewId ? s.athleteId === viewId || s.teamId === viewId : true,
  );

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-3">
      {sorted.map((s) => (
        <Card key={s._id}>
          <CardHeader>
            <CardTitle>{s.event}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-lg font-semibold">
              {Object.entries(s.stats || {})
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")}
            </div>

            <div className="text-sm text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(s.date).toLocaleDateString()}
            </div>

            <Badge variant="outline">{s.athleteId ? s.athlete.name : s.team.name}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
