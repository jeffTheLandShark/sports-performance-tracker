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
  let [author, setAuthor] = useState("");
  let [title, setTitle] = useState("");
  let [tags, setTags] = useState("");
  let [body, setBody] = useState("");
  let [toastOpen, setToastOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      const result = await fetch(`${baseUrl}/posts/${params.id}`).then((resp) =>
        resp.json(),
      );
      setAuthor(result.author || "");
      setTitle(result.title || "");
      setTags((result.tags || []).join(","));
      setBody(result.body || "");
    };

    loadPost();
  }, [params.id]);

  const handleSubmit = async () => {
    await fetch(`${baseUrl}/posts/${params.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        author,
        title,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        body,
      }),
    });

    setToastOpen(true);
    setTimeout(() => {
      setToastOpen(false);
      navigate(`/post/${params.id}`);
    }, 1000);
  };

  return (
    <React.Fragment>
      <H2>Edit Post</H2>
      <form className={formStyle}>
        <TextInput
          label="Author"
          description="Enter your name"
          onChange={(e) => setAuthor(e.target.value)}
          value={author}
        />
        <TextInput
          label="Title"
          description="Enter the title for this blog post"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <TextInput
          label="Tags"
          description="Enter tags for the post, comma separated if multiple"
          onChange={(e) => setTags(e.target.value)}
          value={tags}
        />
        <TextArea
          label="Post body"
          description="Write your article. Be creative and have fun!"
          onChange={(e) => setBody(e.target.value)}
          rows="10"
          value={body}
        />
        <FormFooter
          primaryButton={{
            text: "Update Blog Post",
            onClick: handleSubmit,
          }}
        />
      </form>

      <Toast
        variant="success"
        title="Post Updated"
        body="Your blog post was successfully updated."
        open={toastOpen}
        close={() => setToastOpen(false)}
      />
    </React.Fragment>
  );
}
