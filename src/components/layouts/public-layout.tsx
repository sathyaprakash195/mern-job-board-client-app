import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    // If token exists, redirect to dashboard based on user role
    if (token) {
      // You may need to adjust this based on how you determine user role
      // For now, redirecting to job-seeker dashboard as default
      const role = Cookies.get("role");
      navigate(`/${role}/dashboard`, { replace: true });
    }
  }, [navigate]);

  if (Cookies.get("token")) {
    return null; // or a loading spinner, or redirect logic
  }

  return <>{children}</>;
};
