import React from "react";
import { User, UserRole } from "../../../entities/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  currentUser: User | null;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  currentUser,
  requiredRole,
  fallback = <div>Accesso negato</div>,
}) => {
  if (!currentUser) {
    return <div>Accesso non autorizzato</div>;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
