import { Performance } from "../lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Trash2 } from "lucide-react";
import { deletePerformance } from "../lib/db";
import { useState } from "react";
import { User } from "lucide-react";

interface Props {
  stats: Performance[];
  viewMode?: "all" | "athlete" | "team";
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
      {sorted.map((p) => (
        <Card key={p._id} className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-med font-medium">
                {p.sport}
                {" | "}
                {p.event}
              </CardTitle>

              <button
                onClick={() => handleDelete(p._id)}
                disabled={loadingId === p._id}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-semibold flex items-center gap-2">
              {/* iterate through stats to create display cards for each stat with formatting */}
              {Object.entries(p.stats || {}).map(([k, v]) => (
                <Card key={k} className="inline-block mr-2 mb-2">
                  <CardContent className="p-2 text-center min-w-[100px]">
                    <div className="text-lg font-semibold">{v}</div>
                    <div className="text-xs text-slate-500">{k}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-sm text-slate-500 flex items-center gap-1 mt-2">
              <Calendar className="w-3 h-3" />
              {new Date(p.date).toLocaleDateString()}
            </div>

            <Badge variant="outline" className="mt-2">
              <User className="w-3 h-3" />
              {p.athleteId
                ? p.athlete?.name || p.team?.name || ""
                : p.team?.name || ""}
            </Badge>

            {p.notes && (
              <div className="mt-2 p-2 bg-slate-50 rounded text-sm text-slate-700">
                {p.notes}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
