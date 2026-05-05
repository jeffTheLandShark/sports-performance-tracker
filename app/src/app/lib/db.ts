import { useState, useEffect } from "react";

/* -----------------------------
   CORE ENTITIES
------------------------------*/

export interface Athlete {
  _id?: string;
  name: string;
  birthdate: string;
}

export interface Team {
  _id?: string;
  name: string;
  sport: string;
  athleteIds: string[];
}

export interface Metric {
  name: string;
  unit: string;
  increasingBetter: boolean;
  teamMetric: boolean;
}

export interface Event {
  name: string;
  metrics: Metric[];
}

export interface Sport {
  _id?: string;
  name: string;
  teamSport: boolean;
  events: Event[];
}

/* -----------------------------
   PERFORMANCE (UPDATED)
------------------------------*/

export interface Performance {
  _id?: string;

  sport: string;
  event: string;

  date: string;

  stats: Record<string, number>;

  athleteId?: string;
  teamId?: string;

  teamEntry: boolean;

  notes?: string;
}

/* -----------------------------
   API HELPERS
------------------------------*/

const API = "http://localhost:5050";

/* ATHLETES */
export async function getAthletes(): Promise<Athlete[]> {
  const res = await fetch(`${API}/athletes`);
  return res.json();
}

export async function newAthlete(
  athlete: Omit<Athlete, "_id">
) {
  const res = await fetch(`${API}/athletes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(athlete),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create athlete");
  }

  return res.json();
}

/* TEAMS */
export async function getTeams(): Promise<Team[]> {
  const res = await fetch(`${API}/teams`);
  return res.json();
}

export async function newTeam(
  team: Omit<Team, "_id">
) {
  const res = await fetch(`${API}/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(team),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create team");
  }

  return res.json();
}

export async function addTeammate(
  teamId: string,
  athleteId: string
) {
  const res = await fetch(
    `${API}/teams/${teamId}/add`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athleteId }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to add teammate");
  }

  return res.json();
}

/* SPORTS */
export async function getSports(): Promise<Sport[]> {
  const res = await fetch(`${API}/sports`);
  return res.json();
}

/* PERFORMANCE */
export async function getPerformances(): Promise<Performance[]> {
  const res = await fetch(`${API}/performances`);
  return res.json();
}

export async function addPerformance(
  performance: Omit<Performance, "_id">
) {
  const res = await fetch(`${API}/performances`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(performance),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to add performance");
  }

  return res.json();
}

/* TOP STATS */
export async function topStats(
  sport: string,
  event: string,
  limit = 10
) {
  const res = await fetch(
    `${API}/performances/top?sport=${encodeURIComponent(
      sport
    )}&event=${encodeURIComponent(event)}&limit=${limit}`
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch top stats");
  }

  return res.json();
}

/* HEALTH CHECK */
export async function getDatabase() {
  const res = await fetch(`${API}/ping`);

  if (!res.ok) {
    throw new Error("Failed to connect to database");
  }

  return res.json();
}