import LargeText from "@/components/LargeText";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/api/auth";
import useStore from "@/store/store";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export default function LogIn() {
  const { setIsAuthenticated } = useStore();
  const navigate = useNavigate();

  const loginSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty(),
  });


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const { valid } = await login(data);
    if (!valid) {
      toast.error("Invalid credentials");
    }
    setIsAuthenticated(true);
    navigate({ to: "/" });
  }

  return (
    <div className="flex flex-col gap-4 w-[80%] max-w-[800px] mx-auto z-10">
      <LargeText string="Log in" />
      <div className="z-20 text-white flex flex-col space-y-8">
        <p className="text-white/20">Private service</p>
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Label className="block text-left" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        id="email"
                        name="email"
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Label className="block text-left" htmlFor="password">
                        Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        id="password"
                        name="password"
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
