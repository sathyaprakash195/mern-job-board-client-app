import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "../ui/button";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface NavMenuProps {
  role: string;
  onClose?: () => void;
}

const RECRUITER_MENU: MenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/recruiter/dashboard",
  },
  {
    label: "My Jobs",
    icon: Briefcase,
    path: "/recruiter/jobs",
  },
  {
    label: "Applications",
    icon: FileText,
    path: "/recruiter/applications",
  },
  {
    label: "Profile",
    icon: User,
    path: "/recruiter/profile",
  },
];

const JOB_SEEKER_MENU: MenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/job-seeker/dashboard",
  },
  {
    label: "Browse Jobs",
    icon: Briefcase,
    path: "/job-seeker/jobs",
  },
  {
    label: "Applications",
    icon: FileText,
    path: "/job-seeker/applications",
  },
  {
    label: "Profile",
    icon: User,
    path: "/job-seeker/profile",
  },
];

export const NavMenu = ({ role, onClose }: NavMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = role === "recruiter" ? RECRUITER_MENU : JOB_SEEKER_MENU;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/login", { replace: true });
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full gap-10 mt-20">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive
                ? "bg-gray-50 border border-slate-300 text-slate-900 font-medium"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Icon size={20} />
            <span className="text-sm">{item.label}</span>
          </div>
        );
      })}

      <Button onClick={handleLogout}>
        <LogOut size={20} />
        Logout
      </Button>
    </div>
  );
};
