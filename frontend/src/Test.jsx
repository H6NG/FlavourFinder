import React from "react";

export default function Test() {

    // no need for useState if you only want console.log
    const recommend = async () => {
        const body = {
            currentLocation: {
                latitude: 49.2659797,
                longitude: -123.2464746
            },
            radius: 2,
            preferences: {
                glutenFree: false,
                vegetarian: false,
                vegan: false
            }
        };

        try {
            const res = await fetch(
                "http://javabackend.bungalou.ca/api/v1/restauraunt/recommend-guest",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const data = await res.json();

            // 👇 Print API response to console
            console.log("API RESPONSE:", JSON.stringify(data, null, 2));

        } catch (error) {
            console.error("ERROR calling API:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Restaurants</h1>

            {/* CLICKABLE DIV BUTTON */}
            <div
                onClick={recommend}
                style={{
                    display: "inline-block",
                    padding: "10px 18px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    userSelect: "none",
                    fontWeight: "600",
                    marginTop: "10px",
                }}
            >
                Recommend
            </div>
        </div>
    );
}
