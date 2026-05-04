export const CUSTOM_OPTION = "__custom__";

export const SPORT_CATALOG = {
  track: {
    label: "Track",
    events: {
      "100m": ["time"],
      "200m": ["time"],
      "400m": ["time"],
      "Long Jump": ["distance"],
    },
  },
  powerlifting: {
    label: "Powerlifting",
    events: {
      Squat: ["weight", "reps"],
      Bench: ["weight", "reps"],
      Deadlift: ["weight", "reps"],
    },
  },
  soccer: {
    label: "Soccer",
    events: {
      Match: ["goals", "assists", "minutes"],
      Training: ["minutes", "sprints"],
    },
  },
};

export const getSportOptions = () =>
  Object.entries(SPORT_CATALOG).map(([key, value]) => ({
    value: key,
    label: value.label,
  }));

export const getEventOptions = (sportKey) => {
  if (!sportKey || sportKey === CUSTOM_OPTION || !SPORT_CATALOG[sportKey]) {
    return [];
  }

  return Object.keys(SPORT_CATALOG[sportKey].events).map((eventName) => ({
    value: eventName,
    label: eventName,
  }));
};

const toRow = (fieldName, value = "") => ({ fieldName, value: String(value) });

export const getTemplateRows = (sportKey, eventName) => {
  if (
    !sportKey ||
    !eventName ||
    sportKey === CUSTOM_OPTION ||
    !SPORT_CATALOG[sportKey] ||
    !SPORT_CATALOG[sportKey].events[eventName]
  ) {
    return [];
  }

  return SPORT_CATALOG[sportKey].events[eventName].map((fieldName) =>
    toRow(fieldName),
  );
};

export const mergeTemplateRows = (templateRows, currentRows) => {
  const currentMap = new Map(
    currentRows
      .filter((row) => row.fieldName.trim())
      .map((row) => [row.fieldName.trim(), row.value]),
  );

  const merged = templateRows.map((row) => ({
    fieldName: row.fieldName,
    value: currentMap.get(row.fieldName) || "",
  }));

  const templateSet = new Set(templateRows.map((row) => row.fieldName));
  const customRows = currentRows.filter(
    (row) => row.fieldName.trim() && !templateSet.has(row.fieldName.trim()),
  );

  return [...merged, ...customRows];
};

export const statsObjectToRows = (statsObj = {}) =>
  Object.entries(statsObj).map(([fieldName, value]) =>
    toRow(fieldName, typeof value === "object" ? JSON.stringify(value) : value),
  );

const parseValue = (rawValue) => {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return "";
  }

  try {
    return JSON.parse(trimmed);
  } catch (_error) {
    return rawValue;
  }
};

export const rowsToStatsObject = (rows = []) => {
  const stats = {};

  rows.forEach((row) => {
    const key = row.fieldName.trim();

    if (!key) {
      return;
    }

    stats[key] = parseValue(row.value || "");
  });

  return stats;
};
