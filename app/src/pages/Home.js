import React, { useState, useEffect } from "react";
import PostSummary from "../components/PostSummary";
import { baseUrl } from "../config";

export default function App() {
  let [performances, setPerformances] = useState([]);

  useEffect(() => {
    const loadPerformances = async () => {
      let results = await fetch(`${baseUrl}/performances/latest`).then((resp) =>
        resp.json(),
      );
      setPerformances(results);
    };

    loadPerformances();
  }, []);

  return (
    <React.Fragment>
      <h2 className="text-3xl font-bold mb-6">Recent Performances</h2>
      <div>
        {performances.map((post) => {
          return <PostSummary {...post} key={post._id} />;
        })}
      </div>
    </React.Fragment>
  );
}
