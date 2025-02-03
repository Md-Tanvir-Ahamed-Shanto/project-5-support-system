/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children,allowedRoles  }) {
  const { user,loading } = useContext(UserContext);
  if (loading && !user) {
      return <div>Loading...</div>; // Optional: Add a spinner or skeleton here
    }
    console.log("protected route",user)
    if (!user) {
        return <Navigate to="/login" />;
      }
    
      // Check if the user's role is allowed for this route
      if (!allowedRoles.includes(user.role)) {
        // Redirect to a "not authorized" page or default page based on the role
        if (user.role === "admin") {
          return <Navigate to="/admin" />;
        } else if (user.role === "agent") {
          return <Navigate to="/agent" />;
        }
      }
  

  return children;
}
