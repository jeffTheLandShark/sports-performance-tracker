import React, { useState, useEffect } from "react";
import { H2 } from "@leafygreen-ui/typography";
import TextInput from "@leafygreen-ui/text-input";
import TextArea from "@leafygreen-ui/text-area";
import FormFooter from "@leafygreen-ui/form-footer";
import Toast from "@leafygreen-ui/toast";
import { css } from "@leafygreen-ui/emotion";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../config";

const formStyle = css`
  height: 100vh;
  min-width: 767px;
  margin: 10px;

  input {
    margin-bottom: 20px;
  }
`;

export default function App() {
  let [athlete, setAthlete] = useState("Brother");
  let [sport, setSport] = useState("");
  let [event, setEvent] = useState("");
  let [date, setDate] = useState("");
  let [stats, setStats] = useState('{"time": 11.2}');
  let [tags, setTags] = useState("");
  let [notes, setNotes] = useState("");
  let [toastOpen, setToastOpen] = useState(false);
  let [toastError, setToastError] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      const result = await fetch(`${baseUrl}/performances/${params.id}`).then((resp) =>
        resp.json(),
      );
      setAthlete(result.athlete || "Brother");
      setSport(result.sport || "");
      setEvent(result.event || "");
      setDate(result.date ? new Date(result.date).toISOString().slice(0, 10) : "");
      setStats(JSON.stringify(result.stats || {}, null, 2));
      setTags((result.tags || []).join(","));
      setNotes(result.notes || "");
    };

    loadPost();
  }, [params.id]);

  const handleSubmit = async () => {
    let parsedStats;

    try {
      parsedStats = JSON.parse(stats);
    } catch (_error) {
      setToastError("Stats must be valid JSON (example: {\"time\": 11.2})");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 3000);
      return;
    }

    const response = await fetch(`${baseUrl}/performances/${params.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        athlete,
        sport,
        event,
        date,
        stats: parsedStats,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        notes,
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      setToastError(result.error || "Unable to update performance");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 3000);
      return;
    }

    setToastError("");

    setToastOpen(true);
    setTimeout(() => {
      setToastOpen(false);
      navigate(`/performance/${params.id}`);
    }, 1000);
  };

  return (
    <React.Fragment>
      <H2>Edit Performance</H2>
      <form className={formStyle}>
        <TextInput
          label="Athlete"
          description="Name of the athlete"
          onChange={(e) => setAthlete(e.target.value)}
          value={athlete}
        />
        <TextInput
          label="Sport"
          description="Examples: track, powerlifting, soccer"
          onChange={(e) => setSport(e.target.value)}
          value={sport}
        />
        <TextInput
          label="Event"
          description="Examples: 100m, squat, goals"
          onChange={(e) => setEvent(e.target.value)}
          value={event}
        />
        <TextInput
          type="date"
          label="Date"
          description="Date the performance happened"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
        <TextArea
          label="Stats (JSON)"
          description='Flexible stats object. Example: {"time": 11.2}'
          onChange={(e) => setStats(e.target.value)}
          rows="5"
          value={stats}
        />
        <TextInput
          label="Tags"
          description="Optional tags, comma separated"
          onChange={(e) => setTags(e.target.value)}
          value={tags}
        />
        <TextArea
          label="Notes"
          description="Optional context about this result"
          onChange={(e) => setNotes(e.target.value)}
          rows="10"
          value={notes}
        />
        <FormFooter
          primaryButton={{
            text: "Update Performance",
            onClick: handleSubmit,
          }}
        />
      </form>

      <Toast
        variant={toastError ? "warning" : "success"}
        title={toastError ? "Validation Error" : "Performance Updated"}
        body={toastError || "Your performance entry was successfully updated."}
        open={toastOpen}
        close={() => setToastOpen(false)}
      />
    </React.Fragment>
  );
}
