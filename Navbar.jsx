import React from "react";

export default function Navbar({tab, setTab}) {
  return (
    <nav className="navbar">
      <div className="logo">Omni-View</div>
      <div className="tabs">
        <button className={tab==="dashboard"?"active":""} onClick={()=>setTab("dashboard")}>대시보드</button>
        <button className={tab==="alerts"?"active":""} onClick={()=>setTab("alerts")}>알림</button>
      </div>
    </nav>
  );
}
