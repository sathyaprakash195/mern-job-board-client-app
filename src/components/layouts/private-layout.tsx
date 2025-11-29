import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Header from "./header";
import { useUsersStore, type UsersStore } from "@/store/users-store";
import { Spinner } from "../ui/spinner";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const { loading, fetchAndStoreUser , user }: UsersStore = useUsersStore();
  useEffect(() => {
    const token = Cookies.get("token");
    // If no token exists, redirect to login page
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const token = Cookies.get("token");
  // Additional check to ensure token exists before rendering children
  if (!token) {
    return null; // or a loading spinner, or redirect logic
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if(!user) {
      fetchAndStoreUser();
    }
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="px-10 my-5">{children}</div>
    </>
  );
};
