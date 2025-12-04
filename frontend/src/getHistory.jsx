// getHistory.jsx
import React, { useEffect, useState } from "react";
import { getCookie } from "./utility/cookies.js";

const BACKEND_BASE = "https://c2tp-backend-python.onrender.com";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const accessToken = getCookie("accessToken");
        if (!accessToken) {
          setError("You are not logged in (no access token found).");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BACKEND_BASE}/api/getHistory`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Request failed (${res.status}): ${text}`);
        }

        const data = await res.json();
        // adjust this depending on your backend shape
        // e.g. { history: [...] } vs just [...]
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

  if (loading) {
    return (
      <div className="content-container">
        <p>Loading history…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="content-container">
        <p>No history yet.</p>
      </div>
    );
  }

  return (
    <div className="content-container">
      <h2>Your restaurant history</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.map((item, idx) => {
          // Try to guess common fields; fall back to JSON dump
          const name =
            item.restaurantName ||
            item.name ||
            item.restaurant ||
            `Visit #${idx + 1}`;
          const time =
            item.visitedAt ||
            item.date ||
            item.timestamp ||
            "";

          const extra =
            item.address ||
            item.location ||
            item.notes ||
            "";

          return (
            <li
              key={item.id || idx}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "8px",
              }}
            >
              <strong>{name}</strong>
              {time && <div style={{ fontSize: "0.9rem" }}>When: {time}</div>}
              {extra && (
                <div style={{ fontSize: "0.9rem" }}>Info: {extra}</div>
              )}

              {!time && !extra && (
                <pre
                  style={{
                    marginTop: "6px",
                    fontSize: "0.8rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {JSON.stringify(item, null, 2)}
                </pre>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
