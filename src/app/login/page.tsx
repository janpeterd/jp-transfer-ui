import { login } from "@/api/auth";
import { Button } from "@/components/ui/button"; // Assuming ShadCN/UI Button
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"; // Assuming ShadCN/UI Form components
import { Input } from "@/components/ui/input"; // Assuming ShadCN/UI Input
import { Label } from "@/components/ui/label"; // Assuming ShadCN/UI Label
import useStore from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router"; // Added Link
import { Lock, LogInIcon, Mail } from "lucide-react"; // Added icons
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function LogIn() {
  const { setIsAuthenticated } = useStore();
  const navigate = useNavigate({ from: '/login' }); // Specify 'from' if needed for type safety or specific hooks

  const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }).nonempty({ message: "Email is required." }),
    password: z.string().min(1, { message: "Password is required." }), // Changed from nonempty for clearer message
  });


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
      setIsAuthenticated(true);
      toast.success("Successfully logged in!");
      navigate({ to: "/", replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred during login. Please try again later.");
    }
  };

  return (
    <>
      <div className="-mt-12 flex flex-col items-center justify-center w-full min-h-[calc(100vh-150px)] px-4 z-10"> {/* Adjust min-h if needed */}
        <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-500 mb-2">
              Welcome Back!
            </h1>
            <p className="text-neutral-400 text-sm">
              Log in to access your private file transfers.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5"> {/* Adjusted spacing */}
                    <Label htmlFor="email" className="text-sm font-medium text-neutral-300 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-neutral-400" />
                      Email Address
                    </Label>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        id="email"
                        className="bg-neutral-700/50 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:border-blue-500 focus:ring-blue-500 h-11 px-4"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs pt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5"> {/* Adjusted spacing */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-neutral-300 flex items-center">
                        <Lock className="h-4 w-4 mr-2 text-neutral-400" />
                        Password
                      </Label>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        id="password"
                        className="bg-neutral-700/50 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:border-blue-500 focus:ring-blue-500 h-11 px-4"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs pt-1" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base h-11 transition-all duration-150 ease-in-out transform active:scale-[0.98] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-800"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <LogInIcon className="h-5 w-5 mr-2 animate-pulse" /> // Or a spinner icon
                ) : (
                  <LogInIcon className="h-5 w-5 mr-2" />
                )}
                {form.formState.isSubmitting ? "Logging In..." : "Log In"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
