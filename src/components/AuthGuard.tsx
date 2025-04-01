
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: string;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    
    // Check role if required
    if (requiredRole) {
      const userRole = localStorage.getItem("userRole");
      setHasRequiredRole(userRole === requiredRole);
    }
    
    setIsLoading(false);
  }, [requiredRole]);

  if (isLoading) {
    // You could show a loading spinner here
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRequiredRole) {
    // Redirect to dashboard if authenticated but doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
