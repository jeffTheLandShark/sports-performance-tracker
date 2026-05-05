import { useState, useMemo, useEffect } from "react";
import { Sport, Athlete, Team } from "../lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

interface LogStatsProps {
  sports: Sport[];
  athletes: Athlete[];
  teams: Team[];
  onAddStat: (stat: {
    sport: string;
    event: string;
    stats: Record<string, number>;
    date: string;
    notes?: string;
    teamEntry: boolean;
    athleteId?: string;
    teamId?: string;
  }) => void;
}

export function LogStats({
  sports,
  athletes,
  teams,
  onAddStat,
}: LogStatsProps) {
  // -------------------------
  // ENTITY SELECTION
  // -------------------------
  const [entityType, setEntityType] = useState<"athlete" | "team" | "">("");
  const [athleteId, setAthleteId] = useState("");
  const [teamId, setTeamId] = useState("");

  // -------------------------
  // SPORT DATA
  // -------------------------
  const [sport, setSport] = useState("");
  const [event, setEvent] = useState("");

  const [metricValues, setMetricValues] = useState<Record<string, string>>(
    {}
  );

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  // -------------------------
  // DERIVED DATA
  // -------------------------
  const selectedSport = useMemo(
    () => sports.find((s) => s.name === sport),
    [sport, sports]
  );

  const events = selectedSport?.events || [];

  const selectedEvent = useMemo(() => {
    return selectedSport?.events.find((e) => e.name === event);
  }, [event, selectedSport]);

  const metrics = selectedEvent?.metrics || [];

  useEffect(() => {
    setMetricValues({});
  }, [event]);

  // -------------------------
  // HANDLERS
  // -------------------------
  const handleMetricChange = (name: string, value: string) => {
    setMetricValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // HARD REQUIREMENT: entity must exist first
    if (!entityType) {
      toast.error("Select Athlete or Team first");
      return;
    }

    if (entityType === "athlete" && !athleteId) {
      toast.error("Select an athlete");
      return;
    }

    if (entityType === "team" && !teamId) {
      toast.error("Select a team");
      return;
    }

    if (!sport || !event || !date) {
      toast.error("Missing required fields");
      return;
    }

    const parsedStats: Record<string, number> = {};

    for (const metric of metrics) {
      const raw = metricValues[metric.name];

      if (raw === undefined || raw === "") {
        toast.error(`Missing ${metric.name}`);
        return;
      }

      const num = Number(raw);

      if (Number.isNaN(num)) {
        toast.error(`Invalid value for ${metric.name}`);
        return;
      }

      parsedStats[metric.name] = num;
    }

    onAddStat({
      sport,
      event,
      stats: parsedStats,
      date,
      notes: notes || undefined,
      teamEntry: entityType === "team",
      athleteId: entityType === "athlete" ? athleteId : undefined,
      teamId: entityType === "team" ? teamId : undefined,
    });

    toast.success("Performance logged");

    setMetricValues({});
    setNotes("");
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Performance</CardTitle>
        <CardDescription>
          Athlete/Team → Sport → Event → Metrics
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ENTITY TYPE */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={entityType}
              onValueChange={(v: "athlete" | "team") => {
                setEntityType(v);
                setAthleteId("");
                setTeamId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Athlete or Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="athlete">Athlete</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ENTITY SELECTOR */}
          {entityType === "athlete" && (
            <div className="space-y-2">
              <Label>Athlete</Label>
              <Select value={athleteId} onValueChange={setAthleteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select athlete" />
                </SelectTrigger>
                <SelectContent>
                  {athletes.map((a) => (
                    <SelectItem key={a._id as any} value={a._id as any}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {entityType === "team" && (
            <div className="space-y-2">
              <Label>Team</Label>
              <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t._id as any} value={t._id as any}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* SPORT */}
          <div className="space-y-2">
            <Label>Sport</Label>
            <Select
              value={sport}
              onValueChange={(v) => {
                setSport(v);
                setEvent("");
              }}
              disabled={!entityType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((s) => (
                  <SelectItem key={s.name} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* EVENT */}
          <div className="space-y-2">
            <Label>Event</Label>
            <Select
              value={event}
              onValueChange={setEvent}
              disabled={!sport}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e.name} value={e.name}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* METRICS */}
          {metrics.length > 0 && (
            <div className="space-y-4">
              <Label>Metrics</Label>

              {metrics.map((m) => (
                <div key={m.name} className="space-y-2">
                  <Label>{m.name}</Label>

                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={metricValues[m.name] || ""}
                      onChange={(e) =>
                        handleMetricChange(m.name, e.target.value)
                      }
                    />

                    <div className="px-3 flex items-center bg-slate-100 border rounded-md">
                      {m.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DATE */}
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* NOTES */}
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes..."
          />

          <Button type="submit" className="w-full">
            Log Performance
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}