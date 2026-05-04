import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { baseUrl } from "../config";

export default function Post() {
  let params = useParams();
  let [post, setPost] = useState({});
  let [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this performance?")) {
      await fetch(`${baseUrl}/performances/${params.id}`, {
        method: "DELETE",
      });
      return navigate("/");
    }
  };

  useEffect(() => {
    const loadPost = async () => {
      try {
        let results = await fetch(`${baseUrl}/performances/${params.id}`).then(
          (resp) => resp.json(),
        );
        setPost(results);
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading performance...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{post.event}</CardTitle>
          <p className="text-muted-foreground mt-2">
            {post.sport} {post.athlete && `by ${post.athlete}`}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-sm text-muted-foreground">Date</p>
            <p>{new Date(post.date).toLocaleDateString()}</p>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div>
              <p className="font-medium text-sm text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-accent text-accent-foreground px-2 py-1 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="font-medium text-sm text-muted-foreground">Stats</p>
            <pre className="bg-muted p-3 rounded mt-2 overflow-auto text-sm">
              {JSON.stringify(post.stats || {}, null, 2)}
            </pre>
          </div>

          {post.notes && (
            <div>
              <p className="font-medium text-sm text-muted-foreground">Notes</p>
              <p className="mt-2">{post.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => navigate(`/edit/${params.id}`)}
              className="flex items-center gap-2"
            >
              ✏️ Edit Performance
            </Button>
            <Button
              variant="destructive"
              onClick={deletePost}
              className="flex items-center gap-2"
            >
              🗑️ Delete Performance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
