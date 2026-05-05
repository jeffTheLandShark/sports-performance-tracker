import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dashboard } from "./components/Dashboard";
import { LogStats } from "./components/LogStats";
import { History } from "./components/History";
import { Trophy, PlusCircle, Clock } from "lucide-react";
import { Toaster } from "sonner";

import {
  Athlete,
  Team,
  Performance,
  Sport,
  getSports,
  addPerformance,
  getPerformances,
  getAthletes,
  getTeams,
} from "./lib/db";

import { Button } from "./components/ui/button";
import { CreateAthleteTeam } from "./components/NewPeople";

export default function App() {
  const [viewMode, setViewMode] = useState<"all" | "athlete" | "team">("all");
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [stats, setStats] = useState<Performance[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [allStats, sportData, athData, teamData] = await Promise.all([
        getPerformances(),
        getSports(),
        getAthletes(),
        getTeams(),
      ]);

      setStats(allStats);
      setSports(sportData);
      setAthletes(athData);
      setTeams(teamData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* HEADER */}
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl mb-2 text-slate-900">
              Sports Stats Tracker
            </h1>
            <p className="text-slate-600">
              Track your athletic progress and top scores
            </p>
          </div>

          <Button variant="outline" onClick={loadAll}>
            Refresh
          </Button>

          <Button onClick={() => setOpenCreate(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add
          </Button>
        </header>

        {/* CREATE MODAL */}
        <CreateAthleteTeam
          open={openCreate}
          setOpen={setOpenCreate}
          athletes={athletes}
          teams={teams}
          onRefresh={loadAll}
        />

        {/* TABS */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">
              <Trophy className="w-4 h-4" />
              Top Scores
            </TabsTrigger>

            <TabsTrigger value="log">
              <PlusCircle className="w-4 h-4" />
              Log Stats
            </TabsTrigger>

            <TabsTrigger value="history">
              <Clock className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              stats={stats}
              viewMode={viewMode}
              viewId={selectedAthlete || selectedTeam || ""}
            />
          </TabsContent>

          <TabsContent value="log">
            <LogStats
              onAddStat={addPerformance}
              sports={sports}
              athletes={athletes}
              teams={teams}
            />
          </TabsContent>

          <TabsContent value="history">
            <History
              stats={stats}
              viewMode={viewMode}
              viewId={selectedAthlete || selectedTeam || ""}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
