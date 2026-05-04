import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Link } from "react-router-dom";

const badgeColors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-red-100 text-red-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
];

const getBadgeColor = (tag) => {
  let tagId =
    tag
      .split("")
      .map((char) => char.charCodeAt(0))
      .reduce((s, a) => s + a, 0) % 6;
  return badgeColors[tagId];
};

export default function PostSummary(props) {
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>{props.event}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {props.sport} by {props.athlete} on{" "}
          {new Date(props.date).toLocaleDateString()}
        </p>
        <Link
          to={`/performance/${props._id}`}
          className="text-primary hover:underline text-sm mb-3 inline-block"
        >
          View Details
        </Link>
        <div className="flex flex-wrap gap-2 mt-2">
          {props &&
            props.tags &&
            props.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`inline-block px-2 py-1 rounded text-xs ${getBadgeColor(
                  tag,
                )}`}
              >
                {tag}
              </span>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
