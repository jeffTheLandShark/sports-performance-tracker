import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface Achievement {
  _id: string;
  athleteId: string;
  event: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

interface Athlete {
  _id: string;
  name: string;
  sport: string;
}

export const Dashboard: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [athletes, setAthletes] = useState<Map<string, Athlete>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [achievementsRes, athletesRes] = await Promise.all([
        fetch("http://localhost:5050/achievements"),
        fetch("http://localhost:5050/athletes"),
      ]);

      const achievementsData = await achievementsRes.json();
      const athletesData = await athletesRes.json();

      // Create athlete map for quick lookup
      const athleteMap = new Map();
      athletesData.forEach((athlete: Athlete) => {
        athleteMap.set(athlete._id, athlete);
      });

      setAchievements(achievementsData);
      setAthletes(athleteMap);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading achievements...</div>;
  }

  // Group achievements by athlete
  const groupedByAthlete = achievements.reduce(
    (acc, achievement) => {
      const athleteId = achievement.athleteId;
      if (!acc[athleteId]) {
        acc[athleteId] = [];
      }
      acc[athleteId].push(achievement);
      return acc;
    },
    {} as Record<string, Achievement[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🏆</span>
        <h2 className="text-2xl font-semibold">Personal Records</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groupedByAthlete).map(
          ([athleteId, athleteAchievements]) => {
            const athlete = athletes.get(athleteId);
            return (
              <Card key={athleteId}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {athlete?.name || "Unknown Athlete"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {athlete?.sport}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {athleteAchievements.map((achievement) => (
                      <div key={achievement._id} className="border-b pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{achievement.event}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {achievement.value} {achievement.unit}
                            </p>
                          </div>
                        </div>
                        {achievement.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}
      </div>

      {achievements.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-muted-foreground">
            No achievements recorded yet. Start logging your performances!
          </p>
        </Card>
      )}
    </div>
  );
};
