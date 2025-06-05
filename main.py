from fastapi import FastAPI, Request
from pydantic import BaseModel
import random

app = FastAPI()

# 예시: 사용자 행위 데이터
class LogData(BaseModel):
    user: str
    action: str
    value: float

alerts = []

@app.post("/api/detect")
async def detect(log: LogData):
    # 아주 단순한 이상행위 감지 시뮬레이션 (value > 0.9)
    anomaly = log.value > 0.9
    if anomaly:
        alerts.append({
            "id": len(alerts) + 1,
            "user": log.user,
            "action": log.action,
            "risk": "Critical",
            "desc": f"{log.user}의 {log.action}에서 이상행위 감지"
        })
    return {"anomaly": anomaly}

@app.get("/api/alerts")
async def get_alerts():
    return alerts[-10:]  # 최신 10개만 반환

@app.get("/api/dashboard")
async def get_dashboard():
    # 실시간 데이터 시뮬레이션
    return {
        "riskScore": random.randint(30, 95),
        "totalEvents": random.randint(250, 300),
        "anomalies": random.randint(0, 5)
    }
