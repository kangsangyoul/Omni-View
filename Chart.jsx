import React, { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function Chart() {
  const [chart, setChart] = useState([{x:0,y:60}]);
  useEffect(()=>{
    const timer = setInterval(()=>{
      setChart(data=>[...data.slice(-19),{
        x: data.length,
        y: Math.round(40+Math.random()*55)
      }]);
    },1200);
    return ()=>clearInterval(timer);
  },[]);
  return (
    <div style={{background:"#23272D",borderRadius:18,padding:"24px 16px",marginTop:20}}>
      <h4 style={{marginBottom:16,fontWeight:700,fontSize:18}}>실시간 위험지수 추이</h4>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chart}>
          <XAxis dataKey="x" hide />
          <YAxis hide domain={[0,100]}/>
          <Tooltip/>
          <Line type="monotone" dataKey="y" stroke="#1EA7FD" strokeWidth={3} dot={false} isAnimationActive />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
