import React from "react";
import { Button } from "./ui/Button";

export default function StatsFieldEditor({
  rows,
  onRowChange,
  onAddRow,
  onRemoveRow,
}) {
  return (
    <div className="my-6">
      <h3 className="font-semibold mb-4">Stats Fields</h3>

      <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b">
        <div className="font-medium text-sm">Field</div>
        <div className="font-medium text-sm">Value</div>
        <div />
      </div>

      <div className="space-y-2 mb-4">
        {rows.map((row, index) => (
          <div
            key={`${row.fieldName}-${index}`}
            className="grid grid-cols-3 gap-2"
          >
            <input
              type="text"
              placeholder="field name"
              value={row.fieldName}
              onChange={(e) => onRowChange(index, "fieldName", e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-input-background text-sm"
            />
            <input
              type="text"
              placeholder="value"
              value={row.value}
              onChange={(e) => onRowChange(index, "value", e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-input-background text-sm"
            />
            <Button
              type="button"
              onClick={() => onRemoveRow(index)}
              variant="destructive"
              size="sm"
              className="text-xs"
            >
              ✕ Remove
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" onClick={onAddRow} className="w-full">
        ➕ Add Field
      </Button>
    </div>
  );
}
