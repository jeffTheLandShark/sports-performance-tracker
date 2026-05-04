import React, { useState, useEffect } from "react";
import { H2, H3, Body } from "@leafygreen-ui/typography";
import Icon from "@leafygreen-ui/icon";
import Button from "@leafygreen-ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../config";

export default function App() {
  let params = useParams();
  let [post, setPost] = useState({});
  const navigate = useNavigate();

  const deletePost = async () => {
    await fetch(`${baseUrl}/performances/${params.id}`, {
      method: "DELETE",
    });
    return navigate("/");
  };

  useEffect(() => {
    const loadPost = async () => {
      let results = await fetch(`${baseUrl}/performances/${params.id}`).then(
        (resp) => resp.json(),
      );
      setPost(results);
    };

    loadPost();
  }, [params.id]);

  return (
    <React.Fragment>
      <H2>{post.event}</H2>
      <H3>
        {post.sport} by {post.athlete}
      </H3>
      <p>Date: {new Date(post.date).toLocaleDateString()}</p>
      <p>
        <Body weight="medium">Tags:</Body>{" "}
        {(post.tags || []).join(", ") || "None"}
      </p>
      <Body weight="medium">Stats:</Body>
      <pre>{JSON.stringify(post.stats || {}, null, 2)}</pre>
      <Body weight="medium">Notes:</Body>
      <p>{post.notes || "No notes provided."}</p>
      <Button
        variant="default"
        leftGlyph={<Icon glyph="Edit" />}
        onClick={() => navigate(`/edit/${params.id}`)}
      >
        Edit Performance
      </Button>
      &nbsp;&nbsp;
      <Button
        variant="danger"
        leftGlyph={<Icon glyph="Trash" />}
        onClick={deletePost}
      >
        Delete Performance
      </Button>
      <br />
      <br />
    </React.Fragment>
  );
}
