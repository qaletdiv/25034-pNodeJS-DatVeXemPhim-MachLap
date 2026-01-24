import { useEffect, useState } from "react";
import Sidebar from "../../component/SidebarAdmin/SidebarAdmin";
import LineChart from "../../component/LineChart/LineChart";
import Stat from "../../component/Stat/Stat";
import { axiosClient } from "../../api/axiosClient";
import { Outlet } from "react-router-dom";

export default function Admin() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar open={open} setOpen={setOpen} />

      <Outlet context={{ open: open }} />
    </div>
  );
}
