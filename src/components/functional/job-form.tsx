import type { IJob } from "@/interfaces";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor, { EditorProvider } from "react-simple-wysiwyg";
import { jobTypes, jobStatuses } from "@/constants";
import { apiRoutes } from "@/constants/api-routes";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import dayjs from "dayjs";

// Form validation schema
const jobFormSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  description: z.string(),
  company: z
    .string()
    .min(2, {
      message: "Company name must be at least 2 characters.",
    })
    .max(100, {
      message: "Company name must not be longer than 100 characters.",
    }),
  locations: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  jobType: z.string().min(1, {
    message: "Please select a job type.",
  }),
  minSalary: z.number().min(0, {
    message: "Minimum salary must be 0 or greater.",
  }),
  maxSalary: z.number().min(0, {
    message: "Maximum salary must be 0 or greater.",
  }),
  lastDateToApply: z.string().min(1, {
    message: "Please select a last date to apply.",
  }),
  experienceRequired: z.string().min(0, {
    message: "Experience required must be a valid number.",
  }),
  status: z.string().min(1, {
    message: "Please select a status.",
  }),
});

interface JobFormProps {
  formType: "add" | "edit";
  initialData?: IJob;
}

function JobForm({ formType, initialData }: JobFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(
    initialData?.description || ""
  );
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    mode: "onTouched",
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      company: initialData?.company || "",
      locations: initialData?.locations || "",
      jobType: initialData?.jobType || "",
      minSalary: initialData?.minSalary || 0,
      maxSalary: initialData?.maxSalary || 0,
      lastDateToApply: initialData?.lastDateToApply ? dayjs(initialData.lastDateToApply).format("YYYY-MM-DD") : "",
      experienceRequired: initialData?.experienceRequired || "",
      status: initialData?.status || "open",
    },
  });

  const handleAddSkill = () => {
     setSkills((prevSkills) => [
       ...prevSkills,
       ...skillInput
         .split(',')
         .map(s => s.trim())
         .filter(s => s && !prevSkills.includes(s))
     ]);
     setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  async function onSubmit(values: z.infer<typeof jobFormSchema>) {
    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    try {
      setLoading(true);

      const formattedValues = {
        ...values,
        skills,
        description: descriptionValue,
      };

      if (formType === "add") {
        await axios.post(apiRoutes.createJob, formattedValues);
        toast.success("Job posted successfully!");
        navigate("/recruiter/jobs");
      } else if (formType === "edit" && initialData?._id) {
        await axios.put(
          `${apiRoutes.editJob}/${initialData._id}`,
          formattedValues
        );
        toast.success("Job updated successfully!");
        navigate("/recruiter/jobs");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <EditorProvider>
      <div className="w-full mx-auto mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter job title"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field with Rich Text Editor */}
            <FormField
              control={form.control}
              name="description"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Editor
                      value={descriptionValue}
                      onChange={(e) => setDescriptionValue(e.target.value)}
                      className="border border-slate-200 rounded-md text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills Field */}
            <div>
              <FormLabel className="text-sm font-medium block mb-2">
                Skills
              </FormLabel>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter skills with comma separated"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddSkill())
                  }
                  className="h-10 flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-6 whitespace-nowrap"
                >
                  Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-5 mt-2">
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className="bg-primary text-white px-3 py-1 rounded flex items-center gap-2 text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:opacity-75 transition-opacity ml-1 text-sm"
                        title="Remove skill"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location, Job Type, Min Salary, Max Salary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Field */}
              <FormField
                control={form.control}
                name="locations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter location"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Type Field */}
              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Job Type
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Min Salary Field */}
              <FormField
                control={form.control}
                name="minSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Min Salary
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Salary Field */}
              <FormField
                control={form.control}
                name="maxSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Max Salary
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Experience, Last Date to Apply, Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Company Field */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Company
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter company name"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Experience Required Field */}
              <FormField
                control={form.control}
                name="experienceRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Experience Required (in years)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Date to Apply Field */}
              <FormField
                control={form.control}
                name="lastDateToApply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Last Date to Apply
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="dd-mm-yyyy"
                        type="date"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Field */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Status
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/recruiter/dashboard")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="px-8">
                {loading
                  ? "Processing..."
                  : formType === "add"
                  ? "Post Job"
                  : "Update Job"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </EditorProvider>
  );
}

export default JobForm;
