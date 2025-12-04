// Feed.jsx
import React, { useEffect, useState } from "react";
import SharePage from "./Share.jsx"; // <-- NEW IMPORT

const BACKEND = "https://c2tp-backend-python.onrender.com";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showShare, setShowShare] = useState(false); // <-- NEW

  // --- Styles matching Settings.jsx ---
  const pageStyle = {
    padding: "30px",
    maxWidth: "650px",
    margin: "0 auto",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const cardStyle = {
    background: "white",
    borderRadius: 12,
    padding: "25px 30px",
    border: "1px solid #e5e7eb",
    marginBottom: 30,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };

  const followButton = {
    background: "white",
    border: "1px solid #2563eb",
    color: "#2563eb",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  };

  const shareButton = {
    background: "#2563eb",
    color: "white",
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    marginBottom: 20,
  };

  // ------------------------------
  // Load all share posts
  // ------------------------------
  const loadPosts = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/getSharedPosts`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load posts");

      setPosts(data.posts || []);
    } catch (err) {
      console.error("Feed error:", err);
      setError("Unable to load shared posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // ------------------------------
  // Show SharePage instead of Feed
  // ------------------------------
  if (showShare) {
    return (
      <div style={pageStyle}>
        <button
          onClick={() => setShowShare(false)}
          style={{
            marginBottom: 20,
            background: "#e5e7eb",
            border: "none",
            padding: "8px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ← Back to Feed
        </button>

        <SharePage />
      </div>
    );
  }

  // ------------------------------
  // Loading / Error / Empty
  // ------------------------------
  if (loading)
    return (
      <div style={pageStyle}>
        <h1>Community Feed</h1>
        <p>Loading posts…</p>
      </div>
    );

  if (error)
    return (
      <div style={pageStyle}>
        <h1>Community Feed</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  // ------------------------------
  // MAIN FEED UI
  // ------------------------------
  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 10 }}>
        Community Feed
      </h1>

      {/* NEW Share Post Button */}
      <button style={shareButton} onClick={() => setShowShare(true)}>
        + Share a Post
      </button>

      {!posts.length && (
        <div style={cardStyle}>No posts shared yet.</div>
      )}

      {posts.map((post) => (
        <div key={post._id} style={cardStyle}>
          {/* Header: Username + Follow */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 22 }}>{post.username}</h2>
            <button style={followButton}>Follow</button>
          </div>

          {/* Restaurant */}
          <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 10 }}>
            📍 {post.restaurant}
          </div>

          {/* Rating */}
          {post.rating !== undefined && (
            <div style={{ fontSize: 15, color: "#444", marginBottom: 8 }}>
              ⭐ <strong>{post.rating} / 5</strong>
            </div>
          )}

          {/* User Comment */}
          {post.comments && (
            <div style={{ fontSize: 15, marginTop: 10, color: "#444" }}>
              💬 {post.comments}
            </div>
          )}

          {/* Timestamp */}
          <div style={{ fontSize: 13, color: "#777", marginTop: 12 }}>
            Posted:{" "}
            {post.postedAt
              ? new Date(post.postedAt).toLocaleString()
              : "Unknown"}
          </div>

          {/* Replies */}
          {post.commentBack?.length > 0 && (
            <div
              style={{
                marginTop: 16,
                padding: 15,
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
              }}
            >
              <h4 style={{ marginBottom: 10 }}>Replies</h4>

              {post.commentBack.map((reply, idx) => (
                <div key={idx} style={{ marginBottom: 6 }}>
                  <strong>{reply.user || "Anonymous"}:</strong>{" "}
                  {reply.text}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
