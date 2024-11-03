import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "./Layout";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation(); // Get the current location

  if (loading) {
    return null; // Optionally, you can render a loading spinner here
  }

  if (!user) {
    // Redirect to login with the intended path
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
      />
    );
  }

  return <Layout>{children}</Layout>;
}
