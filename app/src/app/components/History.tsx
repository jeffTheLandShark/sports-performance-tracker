import { Performance } from "../lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Trash2 } from "lucide-react";
import { deletePerformance } from "../lib/db";
import { useState } from "react";

interface Props {
  stats: Performance[];
  viewId?: string;
  onRefresh?: () => void;
}

export function History({ stats, viewId, onRefresh }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = stats.filter((s) =>
    viewId ? s.athleteId === viewId || s.teamId === viewId : true,
  );

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const handleDelete = async (id?: string) => {
    if (!id) return;

    try {
      setLoadingId(id);
      await deletePerformance(id);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      alert("Failed to delete entry");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {sorted.map((s) => (
        <Card key={s._id} className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{s.event}</CardTitle>

              <button
                onClick={() => handleDelete(s._id)}
                disabled={loadingId === s._id}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-lg font-semibold">
              {Object.entries(s.stats || {})
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")}
            </div>

            <div className="text-sm text-slate-500 flex items-center gap-1 mt-2">
              <Calendar className="w-3 h-3" />
              {new Date(s.date).toLocaleDateString()}
            </div>

            <Badge variant="outline" className="mt-2">
              {s.athleteId
                ? s.athlete?.name || s.team?.name || ""
                : s.team?.name || ""}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
