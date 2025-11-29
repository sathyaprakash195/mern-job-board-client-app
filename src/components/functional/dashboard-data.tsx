import React from "react";
import { BarChart3, Clock, CheckCircle, XCircle } from "lucide-react";
import DashboardCard from "./dashboard-card";

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  rejectedApplications: number;
}

interface DashboardDataProps {
  stats: DashboardStats;
  loading: boolean;
}

function DashboardData({ stats, loading }: DashboardDataProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-200 animate-pulse rounded-lg h-32"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Applications",
      count: stats.totalApplications,
      icon: <BarChart3 size={28} className="text-blue-600" />,
      borderColor: "border-blue-400",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Pending Applications",
      count: stats.pendingApplications,
      icon: <Clock size={28} className="text-yellow-600" />,
      borderColor: "border-yellow-400",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      iconBgColor: "bg-yellow-100",
    },
    {
      title: "Shortlisted Applications",
      count: stats.shortlistedApplications,
      icon: <CheckCircle size={28} className="text-green-600" />,
      borderColor: "border-green-400",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      iconBgColor: "bg-green-100",
    },
    {
      title: "Rejected Applications",
      count: stats.rejectedApplications,
      icon: <XCircle size={28} className="text-red-600" />,
      borderColor: "border-red-400",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      iconBgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <DashboardCard
          key={card.title}
          title={card.title}
          count={card.count}
          icon={card.icon}
          borderColor={card.borderColor}
          textColor={card.textColor}
          bgColor={card.bgColor}
          iconBgColor={card.iconBgColor}
        />
      ))}
    </div>
  );
}

export default DashboardData;
