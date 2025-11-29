import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobTypes } from "@/constants";

interface JobFiltersProps {
  filters: {
    keywords: string;
    location: string;
    jobType: string;
    minSalary: string;
    maxSalary: string;
    experienceLevel: string;
  };
  onFilterChange: (filters: JobFiltersProps["filters"]) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const experienceLevels = [
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-7", label: "5-7 years" },
  { value: "7+", label: "7+ years" },
];

export const JobFilters = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}: JobFiltersProps) => {
  const handleChange = (
    key: keyof JobFiltersProps["filters"],
    value: string
  ) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Filters</h3>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keywords
          </label>
          <Input
            type="text"
            placeholder="enter keywords"
            value={filters.keywords}
            onChange={(e) => handleChange("keywords", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Input
            type="text"
            placeholder="enter location"
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <Select value={filters.jobType} onValueChange={(value) => handleChange("jobType", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Minimum Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Salary
          </label>
          <Input
            type="number"
            placeholder="enter minimum salary"
            value={filters.minSalary}
            onChange={(e) => handleChange("minSalary", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Maximum Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Salary
          </label>
          <Input
            type="number"
            placeholder="enter maximum salary"
            value={filters.maxSalary}
            onChange={(e) => handleChange("maxSalary", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <Select value={filters.experienceLevel} onValueChange={(value) => handleChange("experienceLevel", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select exp" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={onApplyFilters}>
          Filter
        </Button>
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="border-gray-300"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
