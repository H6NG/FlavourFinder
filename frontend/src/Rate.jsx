// Rate.jsx
import React, { useEffect, useState } from "react";
import { getCookie } from "./utility/cookies.js";

const BACKEND = "https://c2tp-backend-python.onrender.com";

export default function RatePage() {
  const accessToken = getCookie("accessToken");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/getHistory`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        const data = await res.json();
        const history = data.history || [];

        const top3 = history.slice(0, 3);

        const normalized = top3.map((h) => ({
          ...h,
          rating: typeof h.rating === "number" ? h.rating : "",
          comment:
            typeof h.notes === "string"
              ? h.notes
              : h.notes && typeof h.notes === "object"
              ? JSON.stringify(h.notes)
              : ""
        }));

        setItems(normalized);
      } catch (err) {
        setError("Unable to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const submitRating = async (item, index) => {
    if (!item.rating || item.rating < 1 || item.rating > 5) {
      alert("Please choose a rating from 1 to 5.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${BACKEND}/api/updateHistory`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          historyId: item._id,
          rating: item.rating,
          notes: item.comment
        })
      });

      if (!res.ok) {
        alert("Error saving rating.");
        return;
      }

      alert("Rating saved!");

      const clone = [...items];
      clone.splice(index, 1);
      setItems(clone);

    } catch {
      alert("Failed to submit rating.");
    }

    setSaving(false);
  };

  // ----------------------------------------
  // Loading / Error / Empty states
  // ----------------------------------------
  if (loading)
    return (
      <div style={{ padding: "24px", marginLeft: "32px" }}>
        <h2>Rate Your Recent Restaurants</h2>
        <p>Loading history…</p>
      </div>
    );

  if (error)
    return (
      <div style={{ padding: "24px", marginLeft: "32px" }}>
        <h2>Rate Your Recent Restaurants</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  if (!items.length)
    return (
      <div style={{ padding: "40px 24px", marginLeft: "32px" }}>
        <h2>Rate Your Recent Restaurants</h2>
        <p style={{ marginTop: "10px" }}>No restaurants to rate right now.</p>
      </div>
    );

  // ----------------------------------------
  // MAIN UI
  // ----------------------------------------
  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "700px",
        marginLeft: "32px"
      }}
    >
      <h2 style={{ marginBottom: "6px" }}>Rate Your Recent Restaurants</h2>
      <p style={{ marginBottom: "20px", color: "#444" }}>
        You can rate the last 3 places you visited.
      </p>

      {items.map((item, index) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "14px",
            padding: "18px 22px",
            marginBottom: "20px",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,0.10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
          }}
        >
          <h3 style={{ margin: "0 0 6px", fontSize: "1.25rem" }}>
            {item.restaurantName}
          </h3>

          <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "12px" }}>
            Visited at:{" "}
            {item.visitedAt
              ? new Date(item.visitedAt).toLocaleString()
              : "Unknown"}
          </div>

          {/* Rating Section */}
          <div style={{ marginBottom: "12px" }}>
            <span style={{ fontWeight: 500 }}>Rating (1–5):</span>{" "}
            <select
              value={item.rating}
              onChange={(e) => {
                const clone = [...items];
                clone[index].rating = Number(e.target.value);
                setItems(clone);
              }}
              style={{
                marginLeft: "10px",
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Choose</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} / 5
                </option>
              ))}
            </select>
          </div>

          {/* Comment Box */}
          <textarea
            placeholder="Write a comment…"
            value={item.comment}
            onChange={(e) => {
              const clone = [...items];
              clone[index].comment = e.target.value;
              setItems(clone);
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "vertical",
              minHeight: "70px",
            }}
          />

          <button
            disabled={saving}
            onClick={() => submitRating(item, index)}
            style={{
              marginTop: "14px",
              background: "#1a73e8",
              color: "white",
              padding: "10px 18px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.95rem",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1669cc")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a73e8")}
          >
            {saving ? "Saving…" : "Submit Rating"}
          </button>
        </div>
      ))}
    </div>
  );
}
