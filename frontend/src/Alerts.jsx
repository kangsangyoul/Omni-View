import React, { useEffect, useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  useEffect(()=>{
    let lastId = 0;
    let es;
    fetch("/api/alerts")
      .then(res=>res.json())
      .then(data => {
        setAlerts(data);
        if (data.length) lastId = data[data.length-1].id;
        es = new EventSource(`/api/alerts/stream?last_id=${lastId}`);
        es.onmessage = evt => {
          const payload = JSON.parse(evt.data);
          lastId = payload.id;
          setAlerts(prev => [...prev.slice(-9), payload]);
        };
      });
    return () => es && es.close();
  },[]);
  return (
    <div>
      <h2 style={{fontWeight:800,marginBottom:12,fontSize:28}}>실시간 알림</h2>
      <a href="/api/alerts/export" style={{color:"#1EA7FD",textDecoration:"none",marginBottom:12,display:"inline-block"}}>CSV 다운로드</a>
      <ul style={{listStyle:"none",padding:0}}>
        {alerts.length===0&&<li>최근 이상행위 없음</li>}
        {alerts.map(a=>
          <li key={a.id} style={{
            background:"#262A2F",color:"#fff",margin:"16px 0",padding:"16px 28px",
            borderRadius:16,boxShadow:"0 2px 8px rgba(30,167,253,0.09)",display:"flex",alignItems:"center"
          }}>
            <b style={{marginRight:14,color:"#FF4B5C",fontSize:20}}>{a.risk}</b>
            <span style={{flex:1}}>{a.desc}</span>
            <span style={{marginLeft:18,opacity:0.5}}>{a.user}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
