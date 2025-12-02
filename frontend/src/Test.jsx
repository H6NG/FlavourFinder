import React from "react";
import "./Test.css";

export default function Test() {

    const [data, setData] = React.useState(null);

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

        const res = await fetch(
            "http://localhost:8000/api/v1/restauraunt/recommend-guest",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(body)
            }
        );

        const dataFromApi = await res.json();
        console.log(dataFromApi);
        setData(dataFromApi);   // <--- store in React state
    };

    return (
        <div>
            <h1>Restaurants</h1>
            
            <button onClick={recommend}>Recommend</button>

            <pre>
                {data && JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}
