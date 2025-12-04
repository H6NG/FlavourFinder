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

  // ---------------------------------------------------------
  // Fetch 3 most recent history entries
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/getHistory`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Backend error:", data);
          throw new Error("Failed to load history");
        }

        const history = data.history || [];
        const top3 = history.slice(0, 3);

        // Initialize rating/comment fields if missing
        const withTempFields = top3.map((h) => ({
          ...h,
          rating: h.rating || "",
          comment: h.notes || "",
        }));

        setItems(withTempFields);
      } catch (err) {
        console.error("Fetch history error:", err);
        setError("Unable to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ---------------------------------------------------------
  // Submit rating to backend
  // ---------------------------------------------------------
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          historyId: item._id,
          rating: item.rating,
          notes: item.comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error saving rating: " + data.error);
        console.error("Rating error:", data);
        return;
      }

      alert("Rating saved!");

      // Remove the rated item from the list (optional but clean)
      const clone = [...items];
      clone.splice(index, 1);
      setItems(clone);

    } catch (err) {
      console.error("Rating submit error:", err);
      alert("Failed to submit rating.");
    }

    setSaving(false);
  };

  // ---------------------------------------------------------
  // Render UI
  // ---------------------------------------------------------
  if (loading) return <p>Loading history…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!items.length) return <p>No restaurants to rate right now.</p>;

  return (
    <div className="content-container" style={{ padding: "20px" }}>
      <h2>Rate Your Recent Restaurants</h2>
      <p>You can rate the last 3 places you visited.</p>

      {items.map((item, index) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            background: "#fafafa",
          }}
        >
          <h3>{item.restaurantName}</h3>

          <div style={{ fontSize: "0.9rem", color: "#555" }}>
            Visited at: {new Date(item.visitedAt).toLocaleString()}
          </div>

          {/* Rating Select */}
          <label style={{ display: "block", marginTop: "10px" }}>
            Rating (1–5):
            <select
              value={item.rating}
              style={{ marginLeft: "10px" }}
              onChange={(e) => {
                const clone = [...items];
                clone[index].rating = Number(e.target.value);
                setItems(clone);
              }}
            >
              <option value="">Choose</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} / 5
                </option>
              ))}
            </select>
          </label>

          {/* Comment Box */}
          <textarea
            placeholder="Write a comment…"
            style={{ width: "100%", marginTop: "10px", padding: "8px" }}
            value={item.comment}
            onChange={(e) => {
              const clone = [...items];
              clone[index].comment = e.target.value;
              setItems(clone);
            }}
          />

          <button
            disabled={saving}
            onClick={() => submitRating(item, index)}
            style={{
              marginTop: "10px",
              background: "#2196F3",
              color: "white",
              padding: "8px 15px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {saving ? "Saving…" : "Submit Rating"}
          </button>
        </div>
      ))}
    </div>
  );
}
