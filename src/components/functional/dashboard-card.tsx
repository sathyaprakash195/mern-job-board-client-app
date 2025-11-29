import React from "react";

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  borderColor: string;
  textColor: string;
  bgColor: string;
  iconBgColor: string;
}

function DashboardCard({
  title,
  count,
  icon,
  borderColor,
  textColor,
  bgColor,
  iconBgColor,
}: DashboardCardProps) {
  return (
    <div
      className={`border-l-4 rounded-lg p-6 ${borderColor} ${bgColor} flex items-center justify-between`}
    >
      <div className="flex flex-col gap-1">
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className={`${textColor} text-4xl font-bold`}>{count}</p>
      </div>
      <div className={`${iconBgColor} p-4 rounded-lg`}>
        {icon}
      </div>
    </div>
  );
}

export default DashboardCard;
