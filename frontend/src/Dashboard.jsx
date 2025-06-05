import React, { useEffect, useState } from "react";
import Chart from "./Chart";

export default function Dashboard() {
  const [data, setData] = useState({riskScore:0, totalEvents:0, anomalies:0});
  useEffect(()=>{
    fetch("/api/dashboard")
      .then(res=>res.json())
      .then(setData);
    const es = new EventSource("/api/dashboard/stream");
    es.onmessage = evt => setData(JSON.parse(evt.data));
    return ()=>es.close();
  },[]);
  return (
    <div>
      <h2 style={{fontWeight:800,marginBottom:12,fontSize:28}}>실시간 대시보드</h2>
      <div style={{display:"flex",gap:32,marginBottom:32}}>
        <Card title="위험점수" value={data.riskScore} highlight/>
        <Card title="이상행위" value={data.anomalies}/>
        <Card title="전체 이벤트" value={data.totalEvents}/>
      </div>
      <Chart/>
    </div>
  );
}

function Card({title, value, highlight}) {
  return (
    <div style={{
      background: highlight ? "linear-gradient(90deg,#36D1C4 0%,#1EA7FD 100%)" : "#23272D",
      color: highlight ? "#181C20" : "#fff",
      padding:"24px 32px",
      borderRadius:18,
      minWidth:170,
      fontWeight:700,
      fontSize:highlight?32:24,
      boxShadow:highlight?"0 6px 18px rgba(30,167,253,0.15)":undefined
    }}>
      <div style={{fontSize:highlight?18:16,fontWeight:500,marginBottom:6}}>{title}</div>
      <div>{value}</div>
    </div>
  );
}
