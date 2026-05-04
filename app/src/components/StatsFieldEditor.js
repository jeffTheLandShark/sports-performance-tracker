import React from "react";
import { css } from "@leafygreen-ui/emotion";
import { Body } from "@leafygreen-ui/typography";

const wrapperStyle = css`
  margin: 16px 0;
`;

const headerStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  margin-bottom: 8px;
`;

const rowStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  margin-bottom: 8px;

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #b8b8b8;
    border-radius: 4px;
  }

  button {
    border: 1px solid #6b7280;
    border-radius: 4px;
    background: #ffffff;
    padding: 8px 10px;
    cursor: pointer;
  }
`;

const addButtonStyle = css`
  border: 1px solid #2d4f8f;
  border-radius: 4px;
  background: #f5f7ff;
  color: #1f3d73;
  padding: 8px 12px;
  cursor: pointer;
`;

export default function StatsFieldEditor({
  rows,
  onRowChange,
  onAddRow,
  onRemoveRow,
}) {
  return (
    <div className={wrapperStyle}>
      <Body weight="medium">Stats Fields</Body>
      <div className={headerStyle}>
        <Body weight="medium">Field</Body>
        <Body weight="medium">Value</Body>
        <div />
      </div>

      {rows.map((row, index) => (
        <div key={`${row.fieldName}-${index}`} className={rowStyle}>
          <input
            type="text"
            placeholder="field name"
            value={row.fieldName}
            onChange={(e) => onRowChange(index, "fieldName", e.target.value)}
          />
          <input
            type="text"
            placeholder="value"
            value={row.value}
            onChange={(e) => onRowChange(index, "value", e.target.value)}
          />
          <button type="button" onClick={() => onRemoveRow(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" className={addButtonStyle} onClick={onAddRow}>
        Add Field
      </button>
    </div>
  );
}
