import os
import json
from dotenv import load_dotenv
import psycopg2

load_dotenv()

try:
    conn = psycopg2.connect(
        host=os.getenv("db_host"),
        dbname=os.getenv("db_name"),
        user=os.getenv("db_user"),
        password=os.getenv("db_password"),
        port=os.getenv("db_port"),
        sslmode="disable"
    )
    print("Connected to DB!")
except Exception as e:
    print("DB CONNECTION ERROR:", e)
    exit()

cur = conn.cursor()

with open("restaurants.json") as f:
    data = json.load(f)

print(f"Importing {len(data)} restaurants...")

# Insert ONLY ONE entry
#r = data[0]   # <--- change index if needed (0 = first)
for r in data: 
    if r["name"] is None: continue
    cur.execute("""
        INSERT INTO restauraunt (osmid, resname, locatLat, locatLong)
        VALUES (%s, %s, %s, %s); 
    """, (
        r["osm_id"],
        r["name"],
        r["lat"],
        r["lon"]
    ))

conn.commit()
cur.close()
conn.close()

print("Inserted one restaurant:", r["name"])
