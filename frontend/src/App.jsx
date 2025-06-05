import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Alerts from "./Alerts";

function App() {
  const [tab, setTab] = useState("dashboard");
  return (
    <div style={{fontFamily:"Inter,sans-serif",background:"#181C20",color:"#fff",minHeight:"100vh"}}>
      <header style={{display:"flex",alignItems:"center",padding:"24px 32px"}}>
        <div style={{fontWeight:900,fontSize:"1.5rem",letterSpacing:"0.1em"}}>Omni-View</div>
        <nav style={{marginLeft:32}}>
          <button onClick={()=>setTab("dashboard")} style={navBtn(tab==="dashboard")}>대시보드</button>
          <button onClick={()=>setTab("alerts")} style={navBtn(tab==="alerts")}>알림</button>
        </nav>
      </header>
      <main style={{maxWidth:980,margin:"0 auto",padding:"32px 0"}}>
        {tab==="dashboard" ? <Dashboard/> : <Alerts/>}
      </main>
    </div>
  );
}
const navBtn = selected => ({
  marginRight:16,
  padding:"10px 24px",
  background:selected?"#1EA7FD":"#262A2F",
  color:selected?"#fff":"#B6BDC6",
  border:"none",
  borderRadius:12,
  fontWeight:700,
  fontSize:"1rem",
  cursor:"pointer",
  transition:"0.2s"
});
export default App;
