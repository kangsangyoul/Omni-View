from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import random
import csv
import io
import sqlite3
from pathlib import Path
import asyncio
import json

app = FastAPI()

# SQLite 초기화
DB_PATH = Path(__file__).with_name("alerts.db")
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cur = conn.cursor()
cur.execute(
    """
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        action TEXT,
        risk TEXT,
        desc TEXT
    )
    """
)
conn.commit()

# 예시: 사용자 행위 데이터
class LogData(BaseModel):
    user: str
    action: str
    value: float



@app.post("/api/detect")
async def detect(log: LogData):
    # 아주 단순한 이상행위 감지 시뮬레이션 (value > 0.9)
    anomaly = log.value > 0.9
    if anomaly:
        cur.execute(
            "INSERT INTO alerts (user, action, risk, desc) VALUES (?,?,?,?)",
            (
                log.user,
                log.action,
                "Critical",
                f"{log.user}의 {log.action}에서 이상행위 감지",
            ),
        )
        conn.commit()
    return {"anomaly": anomaly}

@app.get("/api/alerts")
async def get_alerts():
    cur.execute(
        "SELECT id, user, action, risk, desc FROM alerts ORDER BY id DESC LIMIT 10"
    )
    rows = cur.fetchall()
    # id 역순으로 가져온 뒤 최신 순서 유지하려고 reverse
    alerts_list = [
        {"id": r[0], "user": r[1], "action": r[2], "risk": r[3], "desc": r[4]}
        for r in reversed(rows)
    ]
    return alerts_list

@app.get("/api/alerts/stream")
async def stream_alerts(last_id: int = 0):
    async def event_gen():
        nonlocal last_id
        while True:
            cur.execute(
                "SELECT id, user, action, risk, desc FROM alerts WHERE id>? ORDER BY id ASC",
                (last_id,),
            )
            rows = cur.fetchall()
            for r in rows:
                last_id = r[0]
                payload = json.dumps({
                    "id": r[0],
                    "user": r[1],
                    "action": r[2],
                    "risk": r[3],
                    "desc": r[4],
                })
                yield f"data: {payload}\n\n"
            await asyncio.sleep(1)

    return StreamingResponse(event_gen(), media_type="text/event-stream")


@app.get("/api/alerts/export")
async def export_alerts():
    cur.execute("SELECT id, user, action, risk, desc FROM alerts ORDER BY id ASC")
    rows = cur.fetchall()

    def iter_csv():
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(["id", "user", "action", "risk", "desc"])
        yield buffer.getvalue()
        buffer.seek(0)
        buffer.truncate(0)
        for r in rows:
            writer.writerow(r)
            yield buffer.getvalue()
            buffer.seek(0)
            buffer.truncate(0)

    headers = {"Content-Disposition": "attachment; filename=alerts.csv"}
    return StreamingResponse(iter_csv(), media_type="text/csv", headers=headers)

@app.get("/api/dashboard")
async def get_dashboard():
    # 실시간 데이터 시뮬레이션
    return {
        "riskScore": random.randint(30, 95),
        "totalEvents": random.randint(250, 300),
        "anomalies": random.randint(0, 5)
    }


@app.get("/api/dashboard/stream")
async def stream_dashboard():
    async def event_gen():
        while True:
            payload = json.dumps({
                "riskScore": random.randint(30, 95),
                "totalEvents": random.randint(250, 300),
                "anomalies": random.randint(0, 5),
            })
            yield f"data: {payload}\n\n"
            await asyncio.sleep(2)

    return StreamingResponse(event_gen(), media_type="text/event-stream")
