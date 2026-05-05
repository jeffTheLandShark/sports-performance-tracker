import { useState } from "react";
import { Athlete, Team } from "../lib/db";

import { Dialog, DialogContent } from "./ui/dialog";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { newAthlete, newTeam } from "../lib/db";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  athletes: Athlete[];
  teams: Team[];
  onRefresh: () => void;
}

export function CreateAthleteTeam({
  open,
  setOpen,
  athletes,
  onRefresh,
}: Props) {
  const [mode, setMode] = useState<"athlete" | "team">("athlete");

  // athlete
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");

  // team
  const [teamName, setTeamName] = useState("");
  const [sport, setSport] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const reset = () => {
    setName("");
    setBirthdate("");
    setTeamName("");
    setSport("");
    setSelected([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md space-y-4">
        {/* MODE SWITCH */}
        <div className="flex gap-2">
          <Button
            variant={mode === "athlete" ? "default" : "outline"}
            onClick={() => setMode("athlete")}
          >
            Athlete
          </Button>

          <Button
            variant={mode === "team" ? "default" : "outline"}
            onClick={() => setMode("team")}
          >
            Team
          </Button>
        </div>

        {/* ATHLETE FORM */}
        {mode === "athlete" && (
          <div className="space-y-3">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />

            <Label>Birthdate</Label>
            <Input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />

            <Button
              className="w-full"
              onClick={async () => {
                await newAthlete({ name, birthdate });
                reset();
                onRefresh();
                setOpen(false);
              }}
            >
              Create Athlete
            </Button>
          </div>
        )}

        {/* TEAM FORM */}
        {mode === "team" && (
          <div className="space-y-3">
            <Label>Team Name</Label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <Label>Sport</Label>
            <Input value={sport} onChange={(e) => setSport(e.target.value)} />

            <Label>Athletes</Label>
            <div className="border rounded p-2 max-h-40 overflow-auto space-y-2">
              {athletes.map((a) => (
                <label key={a._id as any} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(a._id as any)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected((p) => [...p, a._id as any]);
                      } else {
                        setSelected((p) =>
                          p.filter((id) => id !== (a._id as any)),
                        );
                      }
                    }}
                  />
                  {a.name}
                </label>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={async () => {
                await newTeam({
                  name: teamName,
                  sport,
                  athleteIds: selected,
                } as never);

                reset();
                onRefresh();
                setOpen(false);
              }}
            >
              Create Team
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
