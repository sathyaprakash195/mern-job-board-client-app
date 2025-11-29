import { MapPin, DollarSign, Calendar, Briefcase } from "lucide-react";
import dayjs from "dayjs";
import type { IJob } from "@/interfaces";

interface JobCardProps {
  job: IJob;
  onClick?: (jobId: string) => void;
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
  const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  return (
    <div
      onClick={() => onClick?.(job._id)}
      className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
          <p className="text-sm text-gray-600">From : {job.company}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap capitalize">
          {job.jobType.replaceAll("_", " ")}
        </span>
      </div>

      {/* About the Role */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">About the Role</h4>
        <p className="text-sm text-gray-600 line-clamp-2">
          {job.description.replace(/<[^>]*>/g, "")}
        </p>
      </div>

      {/* Details Row */}
      <div className="flex flex-wrap gap-6 mb-4 py-3 border-y border-gray-200">
        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-gray-500" />
          <span className="text-sm text-gray-700">{job.locations}</span>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-2">
          <DollarSign size={18} className="text-gray-500" />
          <span className="text-sm text-gray-700">
            {formatSalary(job.minSalary, job.maxSalary)}
          </span>
        </div>

        {/* Last Date to Apply */}
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-500" />
          <span className="text-sm text-gray-700">
            Last date to apply - {formatDate(job.lastDateToApply)}
          </span>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-gray-500" />
          <span className="text-sm text-gray-700">
            Min Experience -{job.experienceRequired}years
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};
