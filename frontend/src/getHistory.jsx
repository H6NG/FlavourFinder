// getHistory.jsx
import React, { useEffect, useState } from "react";
import { getCookie } from "./utility/cookies.js";

const BACKEND_BASE = "https://c2tp-backend-python.onrender.com";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cardStyle = {
    background: "white",
    borderRadius: 12,
    padding: "25px 30px",
    border: "1px solid #e5e7eb",
    marginBottom: 25,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    fontFamily: "Inter, Arial, sans-serif",
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
          setError("You are not logged in.");
          return;
        }

        const res = await fetch(`${BACKEND_BASE}/api/getHistory`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.history || [];
        setHistory(list);

      } catch (err) {
        console.error("getHistory error:", err);
        setError("Unable to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // -------------------------------------
  // LOADING / ERROR / EMPTY STATES
  // -------------------------------------
  if (loading)
    return (
      <div style={{ padding: 30, maxWidth: 650, margin: "0 auto" }}>
        Loading history…
      </div>
    );

  if (error)
    return (
      <div
        style={{
          color: "red",
          padding: 30,
          maxWidth: 650,
          margin: "0 auto",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        {error}
      </div>
    );

  if (!history.length)
    return (
      <div
        style={{
          padding: 30,
          maxWidth: 650,
          margin: "0 auto",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 20 }}>
          History
        </h1>
        <div style={cardStyle}>No history yet.</div>
      </div>
    );

  // -------------------------------------
  // MAIN UI
  // -------------------------------------
  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "650px",
        margin: "0 auto",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 25, fontSize: 32, fontWeight: 600 }}>
        History
      </h1>

      {history.map((item, idx) => {
        const name = item.restaurantName || `Visit #${idx + 1}`;
        const visited = item.visitedAt
          ? new Date(item.visitedAt).toLocaleString()
          : "Unknown date";

        const rating = typeof item.rating === "number" ? item.rating : null;
        const notes =
          typeof item.notes === "string"
            ? item.notes
            : item.notes && typeof item.notes === "object"
            ? JSON.stringify(item.notes)
            : "";

        return (
          <div key={item._id || idx} style={cardStyle}>
            <h2 style={{ margin: 0, fontSize: 22 }}>{name}</h2>

            <p style={{ marginTop: 8, color: "#555", fontSize: 15 }}>
              <strong>Visited:</strong> {visited}
            </p>

            {rating !== null && (
              <p style={{ marginTop: 8, color: "#444", fontSize: 15 }}>
                <strong>Rating:</strong> {rating} / 5
              </p>
            )}

            {notes && (
              <p style={{ marginTop: 8, color: "#444", fontSize: 15 }}>
                <strong>Comment:</strong> {notes}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
