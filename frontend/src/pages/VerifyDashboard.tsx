import React from "react";
import { useAuth } from "../helpers/api-communicators";

const VerifyDashboard: React.FC = () => {
  const [user, setUser] = React.useState<{ name: string; role: string } | null>(null);

  React.useEffect(() => {
    useAuth().then((data) => setUser(data));
  }, []);

  return (
    <div>
      <h1>verfiy Dashboard</h1>
      <p>Welcome, {user?.name || "Guest"} ({user?.role || "Unknown Role"})</p>
    </div>
  );
};

export default VerifyDashboard;