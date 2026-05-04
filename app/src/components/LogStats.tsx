import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

interface Athlete {
  _id: string;
  name: string;
  sport: string;
}

interface FormData {
  athleteId: string;
  event: string;
  value: string;
  unit: string;
  date: string;
  notes: string;
}

interface LogStatsProps {
  onAchievementAdded?: () => void;
}

export const LogStats: React.FC<LogStatsProps> = ({ onAchievementAdded }) => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [formData, setFormData] = useState<FormData>({
    athleteId: "",
    event: "",
    value: "",
    unit: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    try {
      const res = await fetch("http://localhost:5050/athletes");
      const data = await res.json();
      setAthletes(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, athleteId: data[0]._id }));
      }
    } catch (error) {
      console.error("Error loading athletes:", error);
      setError("Failed to load athletes");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5050/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athleteId: formData.athleteId,
          event: formData.event,
          value: parseFloat(formData.value),
          unit: formData.unit,
          date: formData.date,
          notes: formData.notes,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add achievement");
      }

      // Reset form
      setFormData({
        athleteId: athletes[0]?._id || "",
        event: "",
        value: "",
        unit: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });

      onAchievementAdded?.();
    } catch (error) {
      console.error("Error adding achievement:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add achievement",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-xl">➕</span>
          <CardTitle>Log Achievement</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="athleteId">Athlete</Label>
            <select
              id="athleteId"
              name="athleteId"
              value={formData.athleteId}
              onChange={handleInputChange}
              className="w-full mt-2 flex h-10 rounded-md border border-input bg-input-background px-3 py-2 text-sm"
              required
            >
              <option value="">Select an athlete</option>
              {athletes.map((athlete) => (
                <option key={athlete._id} value={athlete._id}>
                  {athlete.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="event">Event</Label>
            <Input
              id="event"
              name="event"
              placeholder="e.g., 100m Sprint"
              value={formData.event}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                name="value"
                type="number"
                step="0.01"
                placeholder="e.g., 11.5"
                value={formData.value}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                name="unit"
                placeholder="e.g., seconds"
                value={formData.unit}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Additional notes about this achievement..."
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full mt-2 flex min-h-[100px] rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Achievement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
