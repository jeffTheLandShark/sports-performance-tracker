import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../config";
import StatsFieldEditor from "../components/StatsFieldEditor";
import {
  CUSTOM_OPTION,
  SPORT_CATALOG,
  getSportOptions,
  getEventOptions,
  getTemplateRows,
  mergeTemplateRows,
  rowsToStatsObject,
  statsObjectToRows,
} from "../performanceCatalog";

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
  let [toastMessage, setToastMessage] = useState("");
  let [toastError, setToastError] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const sportOptions = getSportOptions();
  const eventOptions = getEventOptions(sport);
  const selectedSport = sport === CUSTOM_OPTION ? customSport.trim() : sport;
  const selectedEvent = event === CUSTOM_OPTION ? customEvent.trim() : event;

  const updateStatRow = (index, field, value) => {
    setStatRows((rows) =>
      rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  };

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

  useEffect(() => {
    const loadPost = async () => {
      const result = await fetch(`${baseUrl}/performances/${params.id}`).then(
        (resp) => resp.json(),
      );

      const knownSport = Object.prototype.hasOwnProperty.call(
        SPORT_CATALOG,
        result.sport,
      );
      const baseSport = knownSport ? result.sport : CUSTOM_OPTION;
      const knownEvent =
        knownSport &&
        Object.prototype.hasOwnProperty.call(
          SPORT_CATALOG[result.sport].events,
          result.event,
        );

      setAthlete(result.athlete || "Brother");
      setSport(baseSport);
      setCustomSport(knownSport ? "" : result.sport || "");
      setEvent(knownEvent ? result.event : CUSTOM_OPTION);
      setCustomEvent(knownEvent ? "" : result.event || "");
      setDate(
        result.date ? new Date(result.date).toISOString().slice(0, 10) : "",
      );
      setStatRows(statsObjectToRows(result.stats || {}));
      setTags((result.tags || []).join(","));
      setNotes(result.notes || "");
    };

    loadPost();
  }, [params.id]);

  const handleSubmit = async () => {
    if (!selectedSport || !selectedEvent) {
      setToastError("Please select sport and event");
      setTimeout(() => setToastError(""), 3000);
      return;
    }

    const stats = rowsToStatsObject(statRows);

    if (Object.keys(stats).length === 0) {
      setToastError("Please add at least one stats field");
      setTimeout(() => setToastError(""), 3000);
      return;
    }

    const response = await fetch(`${baseUrl}/performances/${params.id}`, {
      method: "PATCH",
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
      setToastError(result.error || "Unable to update performance");
      setTimeout(() => setToastError(""), 3000);
      return;
    }

    setToastError("");
    setToastMessage("Your performance entry was successfully updated.");
    setTimeout(() => {
      setToastMessage("");
      navigate(`/performance/${params.id}`);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl">✏️ Edit Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Athlete Input */}
          <div>
            <Label htmlFor="athlete-input">Athlete</Label>
            <Input
              id="athlete-input"
              placeholder="Name of the athlete"
              onChange={(e) => setAthlete(e.target.value)}
              value={athlete}
              className="mt-2"
            />
          </div>

          {/* Sport Select */}
          <div>
            <Label htmlFor="sport-select">Sport</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select a known sport or choose Custom
            </p>
            <select
              id="sport-select"
              value={sport}
              onChange={(e) => handleSportChange(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-input-background"
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

          {/* Custom Sport Input */}
          {sport === CUSTOM_OPTION && (
            <div>
              <Label htmlFor="custom-sport-input">Custom Sport</Label>
              <Input
                id="custom-sport-input"
                placeholder="Enter your sport name"
                onChange={(e) => setCustomSport(e.target.value)}
                value={customSport}
                className="mt-2"
              />
            </div>
          )}

          {/* Event Select */}
          {sport && sport !== CUSTOM_OPTION && (
            <div>
              <Label htmlFor="event-select">Event</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Event options based on sport
              </p>
              <select
                id="event-select"
                value={event}
                onChange={(e) => setEventWithTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-input-background"
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

          {/* Custom Event Input */}
          {(sport === CUSTOM_OPTION || event === CUSTOM_OPTION) && (
            <div>
              <Label htmlFor="custom-event-input">Custom Event</Label>
              <Input
                id="custom-event-input"
                placeholder="Enter your event name"
                onChange={(e) => setCustomEvent(e.target.value)}
                value={customEvent}
                className="mt-2"
              />
            </div>
          )}

          {/* Selected Event Display */}
          <div>
            <Label htmlFor="selected-event-input">Selected Event</Label>
            <Input
              id="selected-event-input"
              value={selectedEvent}
              disabled
              className="mt-2"
            />
          </div>

          {/* Date Input */}
          <div>
            <Label htmlFor="date-input">Date</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Date the performance happened
            </p>
            <Input
              id="date-input"
              type="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
              className="mt-2"
            />
          </div>

          {/* Stats Field Editor */}
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

          {/* Tags Input */}
          <div>
            <Label htmlFor="tags-input">Tags</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Optional tags, comma separated
            </p>
            <Input
              id="tags-input"
              placeholder="tag1, tag2, tag3"
              onChange={(e) => setTags(e.target.value)}
              value={tags}
              className="mt-2"
            />
          </div>

          {/* Notes Textarea */}
          <div>
            <Label htmlFor="notes-textarea">Notes</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Optional context about this result
            </p>
            <textarea
              id="notes-textarea"
              rows="6"
              placeholder="Any additional notes..."
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
              className="w-full px-3 py-2 border border-input rounded-md bg-input-background font-mono text-sm"
            />
          </div>

          {/* Update Button */}
          <Button onClick={handleSubmit} className="w-full">
            ✏️ Update Performance
          </Button>
        </CardContent>
      </Card>

      {/* Toast Messages */}
      {toastError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded">
          <strong>Validation Error:</strong> {toastError}
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded">
          <strong>Success:</strong> {toastMessage}
        </div>
      )}
    </div>
  );
}
