import React, { useState } from "react";
import { H2 } from "@leafygreen-ui/typography";
import TextInput from "@leafygreen-ui/text-input";
import TextArea from "@leafygreen-ui/text-area";
import FormFooter from "@leafygreen-ui/form-footer";
import Toast from "@leafygreen-ui/toast";
import { css } from "@leafygreen-ui/emotion";
import { baseUrl } from "../config";
import StatsFieldEditor from "../components/StatsFieldEditor";
import {
  CUSTOM_OPTION,
  getSportOptions,
  getEventOptions,
  getTemplateRows,
  mergeTemplateRows,
  rowsToStatsObject,
} from "../performanceCatalog";

const formStyle = css`
  height: 100vh;
  min-width: 767px;
  margin: 10px;

  input {
    margin-bottom: 20px;
  }
`;

const selectGroupStyle = css`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
  }

  p {
    margin: 0 0 8px;
    color: #5f6b7a;
    font-size: 13px;
  }

  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #b8b8b8;
    border-radius: 4px;
    background: #fff;
  }
`;

export default function App() {
  let [athlete, setAthlete] = useState("Brother");
  let [sport, setSport] = useState("");
  let [customSport, setCustomSport] = useState("");
  let [event, setEvent] = useState("");
  let [customEvent, setCustomEvent] = useState("");
  let [date, setDate] = useState("");
  let [statRows, setStatRows] = useState([]);
  let [tags, setTags] = useState("");
  let [notes, setNotes] = useState("");
  let [toastOpen, setToastOpen] = useState(false);
  let [toastError, setToastError] = useState("");

  const sportOptions = getSportOptions();
  const eventOptions = getEventOptions(sport);
  const selectedSport = sport === CUSTOM_OPTION ? customSport.trim() : sport;
  const selectedEvent = event === CUSTOM_OPTION ? customEvent.trim() : event;

  const setEventWithTemplate = (nextEvent) => {
    setEvent(nextEvent);
    setCustomEvent("");
    const templateRows = getTemplateRows(sport, nextEvent);
    setStatRows((currentRows) => mergeTemplateRows(templateRows, currentRows));
  };

  const handleSportChange = (nextSport) => {
    setSport(nextSport);
    setEvent("");
    setCustomSport("");
    setCustomEvent("");
    setStatRows([]);
  };

  const updateStatRow = (index, field, value) => {
    setStatRows((rows) =>
      rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!selectedSport || !selectedEvent) {
      setToastError("Please select sport and event");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 3000);
      return;
    }

    const stats = rowsToStatsObject(statRows);

    if (Object.keys(stats).length === 0) {
      setToastError("Please add at least one stats field");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 3000);
      return;
    }

    const response = await fetch(`${baseUrl}/performances`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        athlete,
        sport: selectedSport,
        event: selectedEvent,
        date,
        stats,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        notes,
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      setToastError(result.error || "Unable to save performance");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 3000);
      return;
    }

    setToastError("");
    setAthlete("Brother");
    setSport("");
    setCustomSport("");
    setEvent("");
    setCustomEvent("");
    setDate("");
    setStatRows([]);
    setTags("");
    setNotes("");
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  };

  return (
    <React.Fragment>
      <H2>Log New Performance</H2>
      <form className={formStyle}>
        <TextInput
          label="Athlete"
          description="Name of the athlete"
          onChange={(e) => setAthlete(e.target.value)}
          value={athlete}
        />

        <div className={selectGroupStyle}>
          <label htmlFor="sport-select">Sport</label>
          <p>Select a known sport or choose Custom</p>
          <select
            id="sport-select"
            value={sport}
            onChange={(e) => handleSportChange(e.target.value)}
          >
            <option value="">Select sport</option>
            {sportOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value={CUSTOM_OPTION}>Custom sport</option>
          </select>
        </div>

        {sport === CUSTOM_OPTION && (
          <TextInput
            label="Custom Sport"
            description="Enter your sport name"
            onChange={(e) => setCustomSport(e.target.value)}
            value={customSport}
          />
        )}

        {sport && sport !== CUSTOM_OPTION && (
          <div className={selectGroupStyle}>
            <label htmlFor="event-select">Event</label>
            <p>Event options based on sport</p>
            <select
              id="event-select"
              value={event}
              onChange={(e) => setEventWithTemplate(e.target.value)}
            >
              <option value="">Select event</option>
              {eventOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              <option value={CUSTOM_OPTION}>Custom event</option>
            </select>
          </div>
        )}

        {(sport === CUSTOM_OPTION || event === CUSTOM_OPTION) && (
          <TextInput
            label="Custom Event"
            description="Enter your event name"
            onChange={(e) => setCustomEvent(e.target.value)}
            value={customEvent}
          />
        )}

        <TextInput
          label="Event"
          description="Selected event"
          value={selectedEvent}
          disabled
        />
        <TextInput
          type="date"
          label="Date"
          description="Date the performance happened"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
        <StatsFieldEditor
          rows={statRows}
          onRowChange={updateStatRow}
          onAddRow={() =>
            setStatRows((rows) => [...rows, { fieldName: "", value: "" }])
          }
          onRemoveRow={(index) =>
            setStatRows((rows) =>
              rows.filter((_, rowIndex) => rowIndex !== index),
            )
          }
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
            text: "Save Performance",
            onClick: handleSubmit,
          }}
        />
      </form>

      <Toast
        variant={toastError ? "warning" : "success"}
        title={toastError ? "Validation Error" : "Performance Saved"}
        body={toastError || "Your performance entry was successfully created."}
        open={toastOpen}
        close={() => setToastOpen(false)}
      />
    </React.Fragment>
  );
}
