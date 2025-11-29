import { useNavigate } from 'react-router-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { userRoles } from "@/constants"
import { toast } from "react-hot-toast"
import axios from "axios"
import { apiRoutes } from "@/constants/api-routes"
import { useState } from "react"
import Cookies from "js-cookie"

// Form validation schema
const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    }),
  role: z
    .string()
    .refine((val) => userRoles.some(r => r.value === val), {
      message: "Please select a valid role.",
    }),
})

function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  })

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const response = await axios.post(
        apiRoutes.loginUrl,
        values
      )
      
      // Store token in cookies
      const token = response.data.token
      Cookies.set('token', token, { expires: 7 })
      Cookies.set('role', values.role, { expires: 7 })
      
      // Store user role for navigation
      const userRole = values.role
      
      // Show success message
      toast.success("Login successful!")
      
      // Navigate based on role
      if (userRole === 'recruiter') {
        navigate("/recruiter/dashboard")
      } else {
        navigate("/job-seeker/dashboard")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Login to your account</h1>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline text-sm font-normal"
          >
            ← Home
          </button>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200 mb-8"></div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Selection Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">I am a</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 font-normal text-sm"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        {/* Register Link */}
        <div className="text-center mt-6 text-sm font-normal text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-primary hover:underline font-normal"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage