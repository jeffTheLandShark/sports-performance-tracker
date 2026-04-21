import React, { useState, useEffect } from "react";
import { H2 } from "@leafygreen-ui/typography";
import PostSummary from "../components/PostSummary";
import { baseUrl } from "../config";

export default function App() {
  let [performances, setPerformances] = useState([]);

  useEffect(() => {
    const loadPerformances = async () => {
      let results = await fetch(`${baseUrl}/performances/`).then((resp) =>
        resp.json(),
      );
      setPerformances(results);
    };

    loadPerformances();
  }, []);

  return (
    <React.Fragment>
      <H2>All Performances</H2>
      <div>
        {performances.map((post) => {
          return <PostSummary {...post} key={post._id} />;
        })}
      </div>
    </React.Fragment>
  );
}
