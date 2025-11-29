import React from "react";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardFiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onFilter: () => void;
  onClear: () => void;
}

function DashboardFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFilter,
  onClear,
}: DashboardFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <label htmlFor="start-date" className="text-sm font-medium text-gray-700">
            Start Date
          </label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            placeholder="dd-mm-yyyy"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="end-date" className="text-sm font-medium text-gray-700">
            End Date
          </label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            placeholder="dd-mm-yyyy"
          />
        </div>

        <Button
          onClick={onClear}
          variant="outline"
        >
          Clear
        </Button>

        <Button
          onClick={onFilter}
          variant="default"
        >
          Filter
        </Button>
      </div>
    </div>
  );
}

export default DashboardFilters;
